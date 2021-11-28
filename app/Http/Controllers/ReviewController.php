<?php

namespace App\Http\Controllers;

// use App\Models\User;
use App\Models\Review;
use Illuminate\Http\Request;
// use App\Models\Images_product;
use App\Models\Images_review;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::get();
        return view('review.list')->with('reviews', $reviews);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('review.form');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // $this->validate($request, ['review' => 'required', 'stars' => 'required']);

        // $review = new Review();
        // $review->review = $request->review;
        // $review->stars = $request->stars;

        // $review->save();

        // return redirect('/taxes/create')->with('status', 'Le review ' . $review->title . ' a été ajoutée');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // renvoi un tableau avec un review et ses images à reviews.blade via axios 
        $review = Review::find($id);
        $tab_review = [];
        $tab_review['review'] = $review;
        $tab_review['name'] = ucwords($review->user->first_name) . ' ' . ucwords(substr($review->user->last_name, 0, 1)) . '.';
        $tab_review['imagesReview'] = Review::find($id)->images_reviews;

       

        return $tab_review;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $review = Review::find($id);

        return view('review.edit')->with('review', $review);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, ['review' => 'required', 'stars' => 'required']);

        $review = Review::find($id);
        $review->review = $request->review;
        $review->stars = $request->stars;

        $review->save();

        return redirect('/taxes')->with('status', 'La modification a été éffectuée');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $review =  Review::find($id);
        $review->delete();
        return back();
    }


    // store les reviews envoyées par les users
    public function storeReveiw(Request $request)
    {
        // dd($request);
        if (Auth::check()) {

            $this->validate($request, ['review' => 'required|max:6000', 'stars' => 'required', 'images' => 'mimes:jpg,jpeg,png']);

            // check si user a déjà laissé un avis, si c est le cas on update sinon on create
            $user_already_posted = Review::where('user_id', Auth::user()->id)->first();
            if ($user_already_posted) {
                $review = $user_already_posted;  
                // efface les anciennes images
                foreach($review->images_reviews as $image) {
                    File::delete(public_path($image->path)); 
                    $image->delete();
                }
            } else {
                $review = new Review();
            }
            
            $review->review = $request->review;
            $review->stars = $request->stars;
            $review->user_id = Auth::user()->id;
            $review->product_id = $request->product_id;
            $review->save();

            if ($request->hasFile('image')) {
                $images = $request->file('image');
                foreach ($images as $image) {
                    $image_review = new Images_review();
                    // on crée une random string pour ajouter au nom de l'image
                    $random = substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz"), 0, 10);
                    // on explode pour récuppérer le nom sans l'extention
                    $imageName = explode(".", $image->getClientOriginalName());
                    $imageName[0] = str_replace(" ", "", $imageName[0]);

                    // on reconstruit le nom de l'image
                    if ($image->getClientOriginalExtension() == '') {
                        // si l'image a été drag drop d'un autre site elle n'aura peut-être pas d'extention même si c'est un fichier png ou autres
                        $input['image'] = $imageName[0] . '_' .  $random . '.jpg';
                    } else {
                        // ici tout est normale
                        $input['image'] = $imageName[0] . '_' .  $random . '.' .  '.jpg';
                    }

                    $destinationPath = public_path('/images/imagesReviews');
                    $imgFile = Image::make($image);

                    $imgFile->resize(500, null, function ($constraint) {
                        $constraint->aspectRatio();
                    });

                    $imgFile->save($destinationPath . '/' . $input['image']);

                    $image_review->path = 'images/imagesReviews/' . $input['image'];
                    $image_review->alt = "Image(s) de " . $request->product_name . " postée(s) par " . Auth::user()->last_name;
                    $image_review->review_id = $review->id;
                    $image_review->save();
                }
            }
        }
    }
}

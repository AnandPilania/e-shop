@extends('website.layouts.head')

@section('content')
<div class="w-full h-full min-h-[calc(100vh_-_112px)] bg-gray-50 flex flex-col justify-start items-center">
<!-- class="w-full h-full flex justify-center items-center   bg-gray-50" -->
    <div id="gjs">
        <h1>Hello World Component!</h1>
    </div>
    <div id="blocks"></div>
    <!-- 
    @include('website.header')

    <h1 class="font-Comfortaa text-white text-6xl mt-40">
        The WEBSITE
    </h1> -->

</div>

@endsection

<script>
    const editor = grapesjs.init({

        // Indicate where to init the editor. You can also pass an HTMLElement
        container: '#gjs',
        // Get the content for the canvas directly from the element
        // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
        fromElement: true,
        // Size of the editor
        height: '300px',
        width: 'auto',
        // Disable the storage manager for the moment
        storageManager: false,
        // Avoid any default panel
        panels: {
            defaults: []
        },
        blockManager: {
            appendTo: '#blocks',
            blocks: [{
                id: 'section', // id is mandatory
                label: '<b>Section</b>', // You can use HTML/SVG inside labels
                attributes: {
                    class: 'gjs-block-section'
                },
                content: `<section>
          <h1>This is a simple title</h1>
          <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
        </section>`,
            }, {
                id: 'text',
                label: 'Text',
                content: '<div data-gjs-type="text">Insert your text here</div>',
            }, {
                id: 'image',
                label: 'Image',
                // Select the component once it's dropped
                select: true,
                // You can pass components as a JSON instead of a simple HTML string,
                // in this case we also use a defined component type `image`
                content: {
                    type: 'image'
                },
                // This triggers `active` event on dropped components and the `image`
                // reacts by opening the AssetManager
                activate: true,
            }]
        },
    });
</script>
import Axios from "axios";

export function saveInTemporaryStorage(key, value, imageName) {
    var tmp_Data = new FormData;

    tmp_Data.append('key', key);

    if (Array.isArray(value)) {
        tmp_Data.append('value', value[0], "myImageName.jpg");
    } else {
        tmp_Data.append('value', value, "myImageName.jpg");
    }


    let response = Axios.post(`http://127.0.0.1:8000/temporaryStoreImages`, tmp_Data,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            console.log('image has been changed');
            return res.data;
        })
        .catch(error => {
            console.log('Error Image upload failed : ' + error.status);
        });

        return response;
}
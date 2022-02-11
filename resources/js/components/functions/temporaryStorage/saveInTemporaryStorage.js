import Axios from "axios";

export function saveInTemporaryStorage(key, value, blobImageName) {
    var tmp_Data = new FormData;
    tmp_Data.append('key', key);

    let name = value.name !== undefined ? value.name : blobImageName;

    if (Array.isArray(value)) {
        tmp_Data.append('value', value[0], name);
    } else {
        tmp_Data.append('value', value, name);
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
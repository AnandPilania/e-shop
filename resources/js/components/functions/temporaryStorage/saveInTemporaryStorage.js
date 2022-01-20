import Axios from "axios";

export function saveInTemporaryStorage(key, value) {
    var tmp_Data = new FormData;

    if (value.length > 0) {
        tmp_Data.append('key', key);

        for (let i = 0; i < value.length; i++) {
            tmp_Data.append('value[]', value[i]);
        }
    };

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
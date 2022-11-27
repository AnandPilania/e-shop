import Axios from 'axios';

export const axiosTools = {
    axiosGet: function(path) {
        Axios.get(`/${path}`)
        .then(res => {
            console.log('res.data   ', res.data);
            return res.data;
        }).catch(function (error) {
            console.log('error:   ' + error);
            return error;
        });
    }
  };
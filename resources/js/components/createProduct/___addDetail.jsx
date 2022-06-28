import React from 'react';


// props.id = detailx
const AddDetail = (props) => {

    return (
        <div className="detail">
            <span className="span_detail">{props.detail}
                <span className="button_detail" onClick={(e) => props.remouveDetail(e, props.detail, props.id)}>x</span>
            </span>
        </div>
    )
}

export default AddDetail;
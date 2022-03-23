import React from 'react';


const CheckboxListCollection = ({ unikId, handleCheckboxListCollection, listCollectionsChecked }) => {


    return (
        <div>
            <input type="checkbox" className="cbx" id={unikId} value={unikId} style={{ display: "none" }} checked={listCollectionsChecked && listCollectionsChecked.includes(unikId)} onChange={(e) => handleCheckboxListCollection(unikId)} />
            <label htmlFor={unikId} className="check">
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                    <polyline points="1 9 7 14 15 4"></polyline>
                </svg>
            </label>
        </div>
    );
}

export default CheckboxListCollection;

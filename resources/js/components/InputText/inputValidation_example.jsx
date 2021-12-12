import { React, useState } from 'react';


const Test = () => {
    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});

    const handleValidation = () => {
        let tmp_fields = fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!tmp_fields["name"]) {
            formIsValid = false;
            errors["name"] = "Cannot be empty";
        }

        if (typeof tmp_fields["name"] !== "undefined") {
            if (!fieltmp_fieldsds["name"].match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                errors["name"] = "Only letters";
            }
        }

        //Email
        if (!tmp_fields["email"]) {
            formIsValid = false;
            errors["email"] = "Cannot be empty";
        }

        if (typeof tmp_fields["email"] !== "undefined") {
            let lastAtPos = tmp_fields["email"].lastIndexOf("@");
            let lastDotPos = tmp_fields["email"].lastIndexOf(".");

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    tmp_fields["email"].indexOf("@@") == -1 &&
                    lastDotPos > 2 &&
                    tmp_fields["email"].length - lastDotPos > 2
                )
            ) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
        }

        setErrors(errors);
        return formIsValid;
    }

    const contactSubmit = (e) => {
        e.preventDefault();

        if (handleValidation()) {
            alert("Form submitted");
        } else {
            alert("Form has errors.");
        }
    }

    const handleChange = (field, e) => {
        let tmp_fields = fields;
        temp_fields[field] = e.target.value;
        setFields(tmp_fields);
    }

    return (
        <div>
            <form
                name="contactform"
                className="contactform"
                onSubmit={contactSubmit}
            >
                <div className="col-md-6">
                    <fieldset>
                        <input
                            ref="name"
                            type="text"
                            size="30"
                            placeholder="Name"
                            onChange={handleChange(this, "name")}
                            value={this.state.fields["name"]}
                        />
                        <span style={{ color: "red" }}>{errors["name"]}</span>
                        <br />
                        <input
                            refs="email"
                            type="text"
                            size="30"
                            placeholder="Email"
                            onChange={handleChange(this, "email")}
                            value={fields["email"]}
                        />
                        <span style={{ color: "red" }}>{errors["email"]}</span>
                        <br />
                        <input
                            refs="phone"
                            type="text"
                            size="30"
                            placeholder="Phone"
                            onChange={handleChange(this, "phone")}
                            value={fields["phone"]}
                        />
                        <br />
                    </fieldset>
                </div>
            </form>
        </div>
    );

}

export default Test;
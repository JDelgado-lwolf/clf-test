import React, { useEffect, useRef, useState } from 'react';
import BaseForm from '@lwt-helix/form-schema';
import { accountSchema, accountUiSchema } from './schemas/accountForm';

const Account = props => {
    const { profile } = props;
    const [formData, setFormData] = useState({});
    const saveButtonRef = useRef(); // will be used to implement the save functionality at a later date

    useEffect(() => {
        profile && setFormData(profile);
    }, [profile]);

    return <div>
        <BaseForm
            dataLwtId="account-form"
            schema={accountSchema}
            uiSchema={accountUiSchema}
            saveButtonRef={saveButtonRef}
            formData={formData}
        />
    </div>;
};

export default Account;

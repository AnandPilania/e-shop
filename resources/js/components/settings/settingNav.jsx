import React from 'react';
import Card from './card';

const SettingNav = ({ setCurrentComponent }) => {
    return (
        <div className=' w-[400px] h-auto flex flex-col justify-start items-start self-start mt-10 rounded-md bg-white'>
            <Card
                icon="trash.svg"
                title="Général"
                text="Free, high quality, open source icon library with over 1, without Bootstrap in any project."
                color="bg-orange-50"
                component=""
                setCurrentComponent={setCurrentComponent}
            />
            <Card
                icon="currency-euro.svg"
                title="Taxes"
                text="Free, high quality, open source icon library with over 1,600 icons.ootstrap in any project."
                color="bg-blue-50"
                component="taxes"
                setCurrentComponent={setCurrentComponent}
            />
            <Card
                icon="truck.svg"
                title="Livraison"
                text="Free, high quality, open source icon ln any project."
                color="bg-yellow-50"
                component="shipping"
                setCurrentComponent={setCurrentComponent}
            />
            <Card
                icon="x.svg"
                title="Bon de commande"
                text="Free, high quality, opeu like—SVGs, SVG sprite, or web fonts. project."
                color="bg-green-50"
                component=""
                setCurrentComponent={setCurrentComponent}
            />
            <Card
                icon="check-green.svg"
                title="E-mails"
                text="Free, high quality, open source icon library with over 1,6out."
                color="bg-zinc-50"
                component=""
                setCurrentComponent={setCurrentComponent}
            />
            <Card
                icon="filter.svg"
                title="Bons de réduction"
                text="Free,source icon library with over 1,600 icons. Include themhout Bootstrap in any project."
                color="bg-red-50"
                component=""
                setCurrentComponent={setCurrentComponent}
            />
            <Card
                icon="filter.svg"
                title="Fournisseurs"
                text="Free,source icon library with over 1,600 icons. Include themhout Bootstrap in any project."
                color="bg-red-50"
                component="suppliers"
                setCurrentComponent={setCurrentComponent}
            />
        </div>
    );
}

export default SettingNav;

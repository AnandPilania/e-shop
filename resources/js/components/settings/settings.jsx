import React from 'react';
import Card from './card';


const Settings = () => {
    return (
        <div className=' w-full md:w-[80%] m-auto flex flex-row justify-start items-start flex-wrap pt-20'>
            <Card
                icon="trash.svg"
                title="Général"
                text="Free, high quality, open source icon library with over 1,600 icons. Include them anye, or web fonts. Use them with or without Bootstrap in any project."
                color="bg-orange-50"
            />
            <Card
                icon="currency-euro.svg"
                title="Taxes"
                text="Free, high quality, open source icon library with over 1,600 icons. Include them anyway you like—SVGs, SVG sprite, or web fonts. Use them with or without Bootstrap in any project."
                color="bg-blue-50"
                link="/taxes"
            />
            <Card
                icon="arrow-left.svg"
                title="Livraison"
                text="Free, high quality, open source icon ln any project."
                color="bg-yellow-50"
            />
            <Card
                icon="x.svg"
                title="Bon de commande"
                text="Free, high quality, opeu like—SVGs, SVG sprite, or web fonts. Use them with or without Bootstrap in any project."
                color="bg-green-50"
            />
            <Card
                icon="check-green.svg"
                title="E-mails"
                text="Free, high quality, open source icon library with over 1,600 icons. Include them anyway you like—SVGs, SVG sprite, or web fonts. Use them with or without."
                color="bg-zinc-50"
            />
            <Card
                icon="filter.svg"
                title="Bons de réduction"
                text="Free, high quality, open source icon library with over 1,600 icons. Include themhout Bootstrap in any project."
                color="bg-red-50"
            />
        </div>
    );
}

export default Settings;

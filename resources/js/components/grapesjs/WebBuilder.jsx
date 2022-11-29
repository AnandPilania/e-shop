import React, { useState, useEffect } from "react";
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import gjsPresetWebPage from 'grapesjs-preset-webpage';

function WebBuilder() {
  const [editor, setEditor] = useState(null);
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      width: 'auto',
      storageManager: false,
      // ...
      // plugins: [gjsPresetWebPage],
      // pluginsOpts: {
      //   [gjsPresetWebPage]: { /* options */ }
      // }
      // or
      // plugins: [
      //   editor => gjsPresetWebPage(editor, { /* options */ }),
      // ],
    });

    setEditor(editor);
  }, []);


  // useEffect(() => {
  // const editor = grapesjs.init({
  //   container: '#gjs',
  //   height: '700px',
  //   width: '100%',
  //   plugins: ['gjs-preset-webpage'],
  //   storageManager: {
  //     id: 'gjs-',
  //     type: 'local',
  //     autosave: true,
  //     storeComponents: true,
  //     storeStyles: true,
  //     storeHtml: true,
  //     storeCss: true,
  //   },
  //   deviceManager: {
  //     devices:
  //       [
  //         {
  //           id: 'desktop',
  //           name: 'Desktop',
  //           width: '',
  //         },
  //         {
  //           id: 'tablet',
  //           name: 'Tablet',
  //           width: '768px',
  //           widthMedia: '992px',
  //         },
  //         {
  //           id: 'mobilePortrait',
  //           name: 'Mobile portrait',
  //           width: '320px',
  //           widthMedia: '575px',
  //         },
  //       ]
  //   },
  //   pluginsOpts: {
  //     'grapesjs-preset-webpage': {
  //       blocksBasicOpts: {
  //         blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
  //         flexGrid: 1,
  //       },
  //       blocks: ['link-block', 'quote', 'text-basic'],
  //     },
  //   }
  // })

//   console.log('editor  ', editor)
// }, [])



return (
  <div id="gjs">
      <h1>Voici mon text</h1>
  </div>

);
}
export default WebBuilder;
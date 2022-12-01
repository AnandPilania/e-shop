import React, { useState, useEffect } from "react";
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import gjsPresetWebPage from 'grapesjs-preset-webpage';
import './pagesBuilder.css';

function WebBuilder() {
  const [editorHook, setEditorHook] = useState(null);
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

      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: 'section', // id is mandatory
            label: '<b>Section</b>', // You can use HTML/SVG inside labels
            attributes: { class: 'gjs-block-section' },
            content: `<section>
              <h1>This is a simple title</h1>
              <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
            </section>`,
          }, {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>',
          }, {
            id: 'image',
            label: 'Image',
            // Select the component once it's dropped
            select: true,
            // You can pass components as a JSON instead of a simple HTML string,
            // in this case we also use a defined component type `image`
            content: { type: 'image' },
            // This triggers `active` event on dropped components and the `image`
            // reacts by opening the AssetManager
            activate: true,
          }
        ]
      },

      panels: {
        defaults: [
          // ...
          {
            id: 'panel-switcher',
            el: '.panel__switcher',
            buttons: [{
                id: 'show-layers',
                active: true,
                label: 'Layers',
                command: 'show-layers',
                // Once activated disable the possibility to turn it off
                togglable: false,
              }, {
                id: 'show-style',
                active: true,
                label: 'Styles',
                command: 'show-styles',
                togglable: false,
            }],
          }
        ]
      },
      // The Selector Manager allows to assign classes and
      // different states (eg. :hover) on components.
      // Generally, it's used in conjunction with Style Manager
      // but it's not mandatory
      selectorManager: {
        appendTo: '.styles-container'
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: [{
            name: 'Dimension',
            open: false,
            // Use built-in properties
            buildProps: ['width', 'min-height', 'padding'],
            // Use `properties` to define/override single property
            properties: [
              {
                // Type of the input,
                // options: integer | radio | select | color | slider | file | composite | stack
                type: 'integer',
                name: 'The width', // Label for the property
                property: 'width', // CSS property (if buildProps contains it will be extended)
                units: ['px', '%'], // Units, available only for 'integer' types
                defaults: 'auto', // Default value
                min: 0, // Min value, available only for 'integer' types
              }
            ]
          },{
            name: 'Extra',
            open: false,
            buildProps: ['background-color', 'box-shadow', 'custom-prop'],
            properties: [
              {
                id: 'custom-prop',
                name: 'Custom Label',
                property: 'font-size',
                type: 'select',
                defaults: '32px',
                // List of options, available only for 'select' and 'radio'  types
                options: [
                  { value: '12px', name: 'Tiny' },
                  { value: '18px', name: 'Medium' },
                  { value: '32px', name: 'Big' },
                ],
             }
            ]
          }]
      },
    });
    
    // Define commands
    editor.Commands.add('show-layers', {
      getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
      getLayersEl(row) { return row.querySelector('.layers-container') },
    
      run(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = '';
      },
      stop(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = 'none';
      },
    });
    editor.Commands.add('show-styles', {
      getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
      getStyleEl(row) { return row.querySelector('.styles-container') },
    
      run(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = '';
      },
      stop(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
      },
    });

    editor.Panels.addPanel({
      id: 'panel-top',
      el: '.panel__top',
    });
    editor.Panels.addPanel({
      id: 'basic-actions',
      el: '.panel__basic-actions',
      buttons: [
        {
          id: 'visibility',
          active: true, // active by default
          className: 'btn-toggle-borders',
          label: '<u>B</u>',
          command: 'sw-visibility', // Built-in command
        }, {
          id: 'export',
          className: 'btn-open-export',
          label: 'Exp',
          command: 'export-template',
          context: 'export-template', // For grouping context of buttons from the same panel
        }, {
          id: 'show-json',
          className: 'btn-show-json',
          label: 'JSON',
          context: 'show-json',
          command(editor) {
            editor.Modal.setTitle('Components JSON')
              .setContent(`<textarea style="width:100%; height: 250px; color:red">
                ${JSON.stringify(editor.getComponents())}
              </textarea>`)
              .open();
          },
        }
      ],
    });

    setEditorHook(editor);
  }, []);

  return (
    <>
    <div className="panel__top">
    <div className="panel__basic-actions"></div>
    <div className="panel__switcher"></div>
</div>
      <div id="gjs">
        <h1>Voici mon text</h1>
      </div>
  <div className="panel__right">
    <div className="layers-container"></div>
    <div className="styles-container"></div>
  </div>





      <div id="blocks"></div>
    </>
  );
}
export default WebBuilder;


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
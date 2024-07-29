import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

export default function RTE({name, control, label, defaultValue =""}) {
  const editorConfig = {
    initialValue: defaultValue,
    height: 500,
    menubar: true,
    plugins: [
      "image",
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "code",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "code",
      "help",
      "wordcount",
      "anchor",
    ],
    toolbar:
      "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
    content_style: `
      body {
        font-family: inter, Arial, sans-serif;
        font-size: 14px;
        background-color: white;
        color: black;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #171717;
          color: white;
        }
      }
    `,
    skin: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'oxide-dark' : 'oxide',
    content_css: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'default',
  };

  return (
    <div className="w-full text-black dark:text-white">
      {label && (
        <label className="block text-sm font-medium text-black dark:text-white mb-1">
          {label}
        </label>
      )}

      <Controller
        name={name || "content"}
        control={control}
        render={({field: {onChange}}) => (
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <Editor
              initialValue={defaultValue}
              init={editorConfig}
              onEditorChange={onChange}
            />
          </div>
        )}
      />
    </div>
  )
}
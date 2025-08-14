import { qwikify$ } from "@builder.io/qwik-react";
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  DiffSourceToggleWrapper,
  CreateLink,
  InsertImage,
  InsertTable,
  BlockTypeSelect,
  CodeToggle,
  InsertAdmonition,
  AdmonitionDirectiveDescriptor,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  diffSourcePlugin,
  codeBlockPlugin,
  directivesPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import React from "react";

interface MdxEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export const MdxEditor = qwikify$(
  (props: MdxEditorProps) => {
    const { content, onChange } = props;
    return React.createElement(MDXEditor, {
      markdown: content,
      onChange: onChange,
      plugins: [
        toolbarPlugin({
          toolbarContents: () =>
            React.createElement(
              React.Fragment,
              null,
              React.createElement(UndoRedo),
              React.createElement(BoldItalicUnderlineToggles),
              React.createElement(BlockTypeSelect),
              React.createElement(CreateLink),
              React.createElement(InsertImage),
              React.createElement(InsertTable),
              React.createElement(CodeToggle),
              React.createElement(InsertAdmonition),
              React.createElement(DiffSourceToggleWrapper, null),
            ),
        }),
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        tablePlugin(),
        diffSourcePlugin(),
        codeBlockPlugin(),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
      ],
      contentEditableClassName: "prose dark:prose-invert",
    });
  },
  { clientOnly: true, eagerness: "visible" },
);

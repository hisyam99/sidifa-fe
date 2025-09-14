import { qwikify$ } from "@qwik.dev/react";
import React from "react";
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
  InsertCodeBlock,
  InsertSandpack,
  sandpackPlugin,
  codeMirrorPlugin,
  frontmatterPlugin,
  InsertFrontmatter,
  InsertThematicBreak,
  ListsToggle,
  searchPlugin,
  jsxPlugin,
  GenericJsxEditor,
  Separator,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

// Example JSX descriptor for custom components
const jsxComponentDescriptors = [
  {
    name: "MyLeaf",
    kind: "text" as const,
    source: "./external",
    props: [
      { name: "foo", type: "string" as const },
      { name: "bar", type: "string" as const },
      { name: "onClick", type: "expression" as const },
    ],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
];

// Example Sandpack config
const simpleSandpackConfig = {
  defaultPreset: "react",
  presets: [
    {
      label: "React",
      name: "react",
      sandpackTemplate: "react" as const,
      meta: "live react",
      sandpackTheme: "light" as const,
      snippetFileName: "/App.js",
      snippetLanguage: "jsx",
      initialSnippetContent: `export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}`.trim(),
    },
  ],
};

// Example image upload handler
const imageUploadHandler = async () => {
  // Replace with your upload logic
  return Promise.resolve("https://picsum.photos/200/300");
};

// Example link autocomplete
// const linkAutocompleteSuggestions = [
//   "https://www.google.com"
// ];

interface MdxEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export const MdxEditor = qwikify$(
  (props: MdxEditorProps) => {
    const { content, onChange } = props;

    // Example error handler
    // const handleError = (error: { error: string; source: string }) => {
    //   console.error("MDX Parsing Error:", error.error, "Source:", error.source);
    // };

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "style",
        null,
        `
          .mdxeditor-popup-container {
            z-index: 20 !important;
          }
        `,
      ),
      React.createElement(MDXEditor, {
        markdown: content,
        onChange: onChange,
        contentEditableClassName:
          "prose prose-sm md:prose-base dark:prose-invert max-w-none",
        suppressHtmlProcessing: false,
        readOnly: false,
        plugins: [
          toolbarPlugin({
            toolbarContents: () =>
              React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  DiffSourceToggleWrapper,
                  null,
                  React.createElement(UndoRedo),
                  React.createElement(Separator),
                  React.createElement(BoldItalicUnderlineToggles),
                  React.createElement(CodeToggle),
                  React.createElement(Separator),
                  React.createElement(ListsToggle),
                  React.createElement(Separator),
                  React.createElement(BlockTypeSelect),
                  React.createElement(Separator),
                  React.createElement(CreateLink),
                  React.createElement(InsertImage),
                  React.createElement(Separator),
                  React.createElement(InsertTable),
                  React.createElement(InsertThematicBreak),
                  React.createElement(Separator),
                  React.createElement(InsertCodeBlock),
                  React.createElement(InsertSandpack),
                  React.createElement(Separator),
                  React.createElement(InsertAdmonition),
                  React.createElement(Separator),
                  React.createElement(InsertFrontmatter),
                ),
              ),
          }),
          headingsPlugin(),
          quotePlugin(),
          listsPlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          // linkDialogPlugin({
          //   linkAutocompleteSuggestions,
          // }),
          imagePlugin({
            imageUploadHandler,
            imageAutocompleteSuggestions: [
              "https://picsum.photos/200/300",
              "https://picsum.photos/200",
            ],
          }),
          tablePlugin(),
          diffSourcePlugin({
            diffMarkdown:
              "Disisi kiri adalah versi lama, disisi kanan adalah versi baru",
            viewMode: "rich-text",
            readOnlyDiff: false,
          }),
          codeBlockPlugin({
            defaultCodeBlockLanguage: "js",
          }),
          sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: "JavaScript",
              css: "CSS",
              txt: "text",
              tsx: "TypeScript",
            },
          }),
          directivesPlugin({
            directiveDescriptors: [AdmonitionDirectiveDescriptor],
          }),
          frontmatterPlugin(),
          searchPlugin(),
          jsxPlugin({ jsxComponentDescriptors }),
        ],
      }),
    );
  },
  { clientOnly: true, eagerness: "hover" },
);

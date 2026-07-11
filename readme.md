# Json Schema UI

> [!CAUTION]
> Work in progress. Schema error handling is not yet supported.

A library of web components (build with StencilJS) that transforms a JSON schema (draft-07) into a simple UI. This UI consists of unstyled standard web components. No other dependencies are used than `json-schema-tools`.

# Using web component

You can start using `<json-schema-ui/>` component right after including this script in your project:

```html
<script type="module" src="https://unpkg.com/json-schema-ui"></script>
```

Then, you can immediately include the component:

```html
<json-schema-ui href="https://example.com/some-json-schema"></json-schema-ui>
```

If your JSON Schema contains many definitions and you want to refer to only one of them, add `path` of the subschema:

```html
<json-schema-ui href="https://example.com/some-json-schema" path="#/definitions/my-subschema"></json-schema-ui>
```

# Installing as dependency

Add our web components to your project as an npm package:

```bash
npm i json-schema-ui
```

# Extensibility

## JsonSchemaParser

You can subclass `JsonSchemaParser` abstract class to implement your own Json Schema UI. It is stateless.

## JsonSchemaUI

The main class that uses `JsonSchemaParser` and already overrides some of it parsing methods to inject some state-driven UI (e.g. `json-schema-ui-array`).

# Dependencies

`json-schema-ui` is a web component library built with "not-a-framework" StencilJS.

We use `json-schema-tools` to parse the JSON Schema object.

# Development

> [!NOTE]  
> Next minor version goal: "schema not loaded" error fallbacks.

> [!NOTE]  
> Next minor version goal: Handling JSON schema from metaschema.

> [!NOTE]  
> Next minor version goal: Unit tests succeed before publishing.

> [!NOTE]  
> Next MAJOR version goal: Unit tests succeed before publishing.
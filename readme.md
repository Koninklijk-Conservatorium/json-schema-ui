# Json Schema UI

> [!CAUTION]
> Work in progress.

A library of web components (build with StencilJS) that transforms a JSON schema (draft-07) into a simple UI. This UI consists of simple unstyled standard web components.

Using json-schema-tools as dependencies.

```html
<json-schema-ui href="https://example.com/some-json-schema"></json-schema-ui>
```

# Extensibility

## JsonSchemaParser

You can subclass `JsonSchemaParser` abstract class to implement your own Json Schema UI. It is stateless.

## JsonSchemaUI

The main class that uses `JsonSchemaParser` and already overrides some of it parsing methods to inject some state-driven UI (e.g. `json-schema-ui-array`).
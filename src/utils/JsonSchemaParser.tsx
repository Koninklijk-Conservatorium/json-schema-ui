import type { ArrayOfSimpleTypes, JSONSchema, JSONSchemaObject } from '@json-schema-tools/meta-schema';
import { h } from '@stencil/core';
import { UUID } from 'crypto';

export abstract class JsonSchemaParser {
  protected parseObject(schema: JSONSchemaObject, name: string) {
    return (
      <div>
        <div>{schema.title ?? name}</div>
        <div>
          <i>{schema.description}</i>
        </div>
        <ul>
          {Object.entries(schema.properties).map(entry => (
            <li>{this.parse(entry[1], entry[0])}</li>
          ))}
        </ul>
      </div>
    );
  }

  protected parseValue(schema: JSONSchema, name: string, jsx) {
    if (!schema || typeof schema === 'boolean') {
      return <div>Cannot load schema.</div>;
    }
    return (
      <div>
        <span>
          <b>{schema.title ?? name}</b>:{' '}
        </span>
        {jsx}
        <span>
          {' '}
          <i>{schema.description}</i>
        </span>
      </div>
    );
  }

  protected parseString(schema: JSONSchemaObject, name: string) {
    const placeholder = schema.examples ? 'e.g. ' + schema.examples.join(', ') : undefined;
    const jsx = (
      <input type="text" required minlength={schema.minLength} maxlength={schema.maxLength} pattern={schema.pattern} placeholder={placeholder ?? ''} size={placeholder?.length} />
    );
    return this.parseValue(schema, name, jsx);
  }

  protected parseNumber(schema: JSONSchemaObject, name: string) {
    const jsx = <input type="number" id="" name="" min={schema.minimum ?? schema.exclusiveMinimum + 1} max={schema.maximum ?? schema.exclusiveMaximum} />;
    return this.parseValue(schema, name, jsx);
  }

  protected parseBoolean(schema: JSONSchemaObject, name: string) {
    const jsx = <input type="checkbox" id="" name="" />;
    return this.parseValue(schema, name, jsx);
  }

  protected parseArray(schema: JSONSchemaObject, name: string) {
    const container = this.parseValue(schema, name, <></>);
    const items = this.parse(schema.items, name);
    return (
      <div>
        <div>
          {container}
          {items}
        </div>
      </div>
    );
  }

  protected parseEnum(schema: JSONSchemaObject, name: string) {
    const jsx = (
      <select>
        {schema.enum.map(v => (
          <option value={v}>
            <b>{v}</b>
          </option>
        ))}
      </select>
    );
    return this.parseValue(schema, name, jsx);
  }

  protected parseAnyOf(schema: JSONSchemaObject, name: string) {
    const unique: UUID = crypto.randomUUID();
    const jsx = (
      <div>
        <fieldset>
          <legend>Any of:</legend>
          {schema.anyOf.map((t, i) => (
            <div>
              <input type="radio" name={unique} id={i + unique} />
              <label htmlFor={i + unique}> {this.parse(t)}</label>
            </div>
          ))}
        </fieldset>
      </div>
    );
    return this.parseValue(schema, name, jsx);
  }

  protected parse(schema?: JSONSchema, name: string = 'root') {
    /* Special cases. */
    if (!schema) {
      return <div>Cannot load schema.</div>;
    } else if (typeof schema === 'boolean') {
      return <div>Cannot load schema.</div>;
    } else if (Array.isArray(schema)) {
      return schema.map(sch => this.parse(sch, 'type'));
    } else {
      /* Build html. */
      switch (schema.type) {
        case undefined:
          if (schema.anyOf) {
            return this.parseAnyOf(schema, name);
          } else if (schema.const) {
            return schema.const;
          } else if (schema.enum) {
            return this.parseEnum(schema, name);
          } else if (schema.properties) {
            return this.parseObject(schema, name);
          } else {
            console.log('Unhandled schema:', schema);
            return <div>Unhandled schema.</div>;
          }
        case 'object':
          return this.parseObject(schema, name);
        case 'string':
          return this.parseString(schema, name);
        case 'number':
        case 'integer':
          return this.parseNumber(schema, name);
        case 'boolean':
          return this.parseBoolean(schema, name);
        case 'array':
          return this.parseArray(schema, name);
        case 'null':
          return <div>'null ???'</div>;
        default:
          /* We have handled ArrayOfSimpleTypes by handling array already above. */
          schema.type satisfies never | ArrayOfSimpleTypes;
      }
    }
    console.log('Unknown schema:', schema);
  }

  componentDidLoad() {}
}

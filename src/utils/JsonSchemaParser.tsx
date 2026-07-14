import type { ArrayOfSimpleTypes, JSONSchema, JSONSchemaObject } from '@json-schema-tools/meta-schema';
import { h } from '@stencil/core';
import { UUID } from 'crypto';

function invalid(schema: JSONSchema, name:string) {
  console.warn(`Cannot display schema at ${name}:`, schema)
  return <div>Cannot load schema.</div>
}

function unhandled(schema: JSONSchema, name: string, info: string = '') {
  info += ' '
  console.warn(`Cannot handle schema ${info}at ${name}:`, schema)
  return <div>Cannot handle schema.</div>
}

/**
 * Basic parsing utilities for JSON Schema.
 */
export abstract class JsonSchemaParser {

  protected parseValue(schema: JSONSchema, key: string, jsx) {
    if (!schema || typeof schema === 'boolean') {
      return invalid(schema, key)
    }
    return (
      <div>
        <span>
          <b>{schema.title ?? key}</b>:{' '}
        </span>
        {jsx}
        <span>
          {' '}
          <i>{schema.description}</i>
        </span>
      </div>
    );
  }

  protected parseObject(schema: JSONSchemaObject, key: string) {
    return (
      <div>
        <div>{schema.title ?? key}</div>
        <div>
          <i>{schema.description}</i>
        </div>
        <ul>
          {Object.entries(schema.properties).map(entry => (<li>
            {schema.required?.includes(entry[0]) ? this.parse(entry[1], entry[0]) :
              (<div>
                <button onClick={(e: Event) => {
                  const button = e.target as HTMLDivElement
                  const div = button.nextSibling as HTMLDivElement
                  const state = div.hidden
                  div.hidden = !state
                  button.textContent = `${state ? 'Remove' : 'Add'} ${entry[1].title}`
                }}>Add {entry[1].title}</button>
                <div hidden>
                  {this.parse(entry[1], entry[0])}
                </div>
              </div>)
            }
          </li>))}
        </ul>
      </div>
    );
  }

  protected parseString(schema: JSONSchemaObject, key: string) {
    const placeholder = schema.examples ? 'e.g. ' + schema.examples.join(', ') : undefined;
    const jsx = (
      <input type="text" required minlength={schema.minLength} maxlength={schema.maxLength} pattern={schema.pattern} placeholder={placeholder ?? ''} size={placeholder?.length} />
    );
    return this.parseValue(schema, key, jsx);
  }

  protected parseNumber(schema: JSONSchemaObject, key: string) {
    const jsx = <input type="number" id="" name="" min={schema.minimum ?? schema.exclusiveMinimum + 1} max={schema.maximum ?? schema.exclusiveMaximum} />;
    return this.parseValue(schema, key, jsx);
  }

  protected parseBoolean(schema: JSONSchemaObject, key: string) {
    const jsx = <input type="checkbox" id="" name="" />;
    return this.parseValue(schema, key, jsx);
  }

  protected parseArray(schema: JSONSchemaObject, key: string) {
    const container = this.parseValue(schema, key, <></>);
    const items = this.parse(schema.items, key);
    return (
      <div>
        <div>
          {container}
          {items}
        </div>
      </div>
    );
  }

  protected parseEnum(schema: JSONSchemaObject, key: string) {
    const jsx = (
      <select>
        {schema.enum.map(v => (
          <option value={v}>
            <b>{v}</b>
          </option>
        ))}
      </select>
    );
    return this.parseValue(schema, key, jsx);
  }

  protected parseAnyOf(schema: JSONSchemaObject, key: string) {
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
    return this.parseValue(schema, key, jsx);
  }

  protected parse(schema?: JSONSchema, key: string = 'root') {
    /* Special cases. */
    if (!schema || (typeof schema === 'boolean')) {
      return invalid(schema, key);
    } else if (Array.isArray(schema)) {
      return schema.map(sch => this.parse(sch, 'type'));
    }
    /* Default types. */
    if (!schema.type) {
      if (schema.anyOf) {
        return this.parseAnyOf(schema, key);
      } else if (schema.const) {
        return schema.const;
      } else if (schema.enum) {
        return this.parseEnum(schema, key);
      } else if (schema.properties) {
        return this.parseObject(schema, key);
      } else {
        return unhandled(schema, key, 'without type')
      }
    }
    /* Specified types. */
    switch (schema.type) {
      case 'object':
        return this.parseObject(schema, key);
      case 'string':
        return this.parseString(schema, key);
      case 'number':
      case 'integer':
        return this.parseNumber(schema, key);
      case 'boolean':
        return this.parseBoolean(schema, key);
      case 'array':
        return this.parseArray(schema, key);
      case 'null':
        return <div>'null ???'</div>;
      default:
        /* We have handled ArrayOfSimpleTypes by handling array already above. */
        schema.type satisfies never | ArrayOfSimpleTypes;
    }
    return unhandled(schema, key, ' without a clear type')
  }

  componentDidLoad() {}
}

import { Component, Prop, State, h } from '@stencil/core';
import { JSONSchemaObject } from '@json-schema-tools/meta-schema';
import { JsonSchemaParser } from '../../utils/JsonSchemaParser';
import { UUID } from 'crypto';

@Component({
  tag: 'json-wizard-array',
  styleUrl: 'json-wizard-array.css',
  shadow: true,
})
export class JsonWizardArray extends JsonSchemaParser {
  $container: HTMLDivElement;

  @Prop() schema: JSONSchemaObject;
  @Prop() name: string;
  @State() items: UUID[] = [];

  removeItem(e: Event) {
    const parent = (e.target as Element).parentElement;
    const parentID = parent.getAttribute('data-id') as UUID;
    this.items.splice(this.items.indexOf(parentID));
    parent.remove();
  }

  addItem() {
    this.items = [...this.items, crypto.randomUUID()];
  }

  parseItem(itemID: UUID) {
    return (
      <fieldset data-id={itemID}>
        {this.parse(this.schema.items, this.name)}
        <button onClick={e => this.removeItem(e)}>Delete</button>
      </fieldset>
    );
  }

  render() {
    return (
      <div>
        <div>{this.schema.title}</div>
        <div ref={el => (this.$container = el)}>{this.items.map((itemID: UUID) => this.parseItem(itemID))}</div>
        <button onClick={_ => this.addItem()}>Add new</button>
      </div>
    );
  }
}

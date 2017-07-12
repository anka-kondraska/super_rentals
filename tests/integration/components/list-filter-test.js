import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import RSVP from 'rsvp';

const ITEMS = [{city: 'Portland'}, {city: 'San Francisco'}, {city: 'Seattle'}];
const FILTERED_ITEMS = [{city: 'San Francisco'}];

moduleForComponent('list-filter', 'Integration | Component | list filter', {
  integration: true
});

// test('it renders', function(assert) {
//
//   // Set any properties with this.set('myProperty', 'value');
//   // Handle any actions with this.on('myAction', function(val) { ... });
//
//   this.render(hbs`{{list-filter}}`);
//
//   assert.equal(this.$().text().trim(), '');
//
//   // Template block usage:
//   this.render(hbs`
//     {{#list-filter}}
//       template block text
//     {{/list-filter}}
//   `);
//
//   assert.equal(this.$().text().trim(), 'template block text');
// });

test('should initially load all listings', function(assert) {
  // we want our actions to return promises, since they are potentially fetching data asynchronously
  this.on('filterByCity', (val) => {
    if (val === '') {
      return RSVP.resolve(ITEMS);
    } else {
      return RSVP.resolve(FILTERED_ITEMS);
    }
  });

  this.render(hbs`
    {{#list-filter filter=(action 'filterByCity') as |results|}}
    <ul>
      {{#each results as |item|}}
        <li class="city">
          {{item.city}}
        </li>
      {{/each}}
    </ul>
    {{/list-filter}}
    `);
    return wait().then(() => {
      assert.equal(this.$('.city').length, 3);
      assert.equal(this.$('.city').first().text().trim(), 'Portland');
    });
});

test('should update with matching listings', function (assert) {
  // we want our actions to return promises, since they are potentially fetching data asynchronously
  this.on('filterByCity', (val) => {
    if (val === '') {
      return RSVP.resolve(ITEMS);
    } else {
      return RSVP.resolve(FILTERED_ITEMS);
    }
  });

  // with an integration test,
    // you can set up and use your component in the same way your application will use it.
  this.render(hbs`
    {{#list-filter filter=(action 'filterByCity') as |results|}}
      <ul>
      {{#each results as |item|}}
        <li class="city">
          {{item.city}}
        </li>
      {{/each}}
      </ul>
    {{/list-filter}}
  `);

  // The keyup event here should invoke an action that will cause the list to be filtered
  this.$('.list-filter input').val('San').keyup();

  return wait().then(() => {
    assert.equal(this.$('.city').length, 1);
    assert.equal(this.$('.city').text().trim(), 'San Francisco');
  });
});

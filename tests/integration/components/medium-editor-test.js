import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find } from 'ember-native-dom-helpers';
import MediumEditor from 'medium-editor';
import sinon from 'sinon';

const meClass = '.medium-editor-element';

moduleForComponent('medium-editor', 'Integration | Component | medium editor', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`{{medium-editor}}`);
  assert.equal(find(meClass).innerHTML, '');
});

test('it sets initial value and updates it', function(assert) {
  assert.expect(2);

  this.set('tempValue', '<h1>Value</h1>');
  this.render(hbs`{{medium-editor tempValue}}`);

  assert.equal(find('h1').innerHTML, 'Value');

  this.set('tempValue', '<h2>New value</h2>');
  assert.equal(find('h2').innerHTML, 'New value');
});

test('it should trigger onChange action when content changed', function(assert) {
  assert.expect(1);

  this.set('onChange', (actual) => {
    assert.equal(actual, '<p>typed value</p>');
  });
  this.render(hbs`{{medium-editor onChange=(action onChange)}}`);

  let editor = MediumEditor.getEditorFromElement(find(meClass));
  editor.setContent('<p>typed value</p>');
});

test('it should pass options', function(assert) {
  assert.expect(1);

  this.set('meOptions', {
    placeholder: { text: 'placeholder test' }
  });
  this.render(hbs`{{medium-editor options=meOptions}}`);

  assert.equal(find(meClass).getAttribute('data-placeholder'), 'placeholder test');
});

test('it should accept "first class" options', function(assert) {
  assert.expect(1);

  this.set('placeholderOption', {
    text: 'test'
  });
  this.render(hbs`{{medium-editor placeholder=placeholderOption}}`);

  assert.equal(find(meClass).getAttribute('data-placeholder'), 'test');
});

test('it should accept options with correct priority', function(assert) {
  assert.expect(1);

  this.set('optionsHash', {
    placeholder: { text: 'hash' }
  });
  this.set('placeholderOption', {
    text: 'option'
  });

  this.render(hbs`{{medium-editor options=optionsHash placeholder=placeholderOption}}`);

  assert.equal(find(meClass).getAttribute('data-placeholder'), 'option');
});

test('it should not fire onChange callback if content did not change', function(assert) {
  assert.expect(1);

  let spy = sinon.spy();
  this.set('value', 'some text');
  this.set('onChange', spy);
  this.render(hbs`{{medium-editor value onChange=onChange}}`);

  this.set('value', 'some text');
  assert.ok(spy.notCalled);
});

test('it should fire medium-editor events if passed', function(assert) {
  assert.expect(1);

  let spy = sinon.spy();
  this.set('value', 'test');
  this.set('callback', spy);
  this.render(hbs`{{medium-editor value editableInput=callback}}`);

  assert.ok(spy.calledOnce);
});

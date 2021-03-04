import { assert } from 'chai';
import EmptyComponent from './components/EmptyComponent';
import SimpleCounterComponent from './components/CounterComponent';
import { Component, Entity } from "../../src";

describe('Entity', () => {
  let entity: Entity;
  let simpleCounterComponent: Component;

  beforeEach(() => {
    entity = new Entity();
    simpleCounterComponent = new SimpleCounterComponent();
  });

  describe('Component', () => {
    describe('Add component', () => {
      it('should add a component', () => {
        entity.addComponent(simpleCounterComponent);

        assert.equal(entity.getComponents().length, 1);
      });

      it('should not add the same component', () => {
        entity.addComponent(simpleCounterComponent);
        entity.addComponent(simpleCounterComponent);

        assert.equal(entity.getComponents().length, 1);
      });

      it('should not add a component of the same class', () => {
        const sameClassComponent = new SimpleCounterComponent();

        entity.addComponent(simpleCounterComponent);
        entity.addComponent(sameClassComponent);

        assert.equal(entity.getComponents().length, 1);
      });

      it('should add 2 differents components', () => {
        const simpleComponent = new EmptyComponent();

        entity.addComponent(simpleCounterComponent);
        entity.addComponent(simpleComponent);

        assert.equal(entity.getComponents().length, 2);
      });
    });

    describe('Get component', () => {
      it('should return the correct component', () => {
        entity.addComponent(simpleCounterComponent);
        entity.addComponent(new EmptyComponent());

        assert.equal(simpleCounterComponent, entity.getComponent(SimpleCounterComponent));
      });

      it('Should return all the components requested', () => {
        entity.addComponent(simpleCounterComponent);
        const simpleComponent = new EmptyComponent();
        entity.addComponent(simpleComponent);

        const components = entity.getComponents([SimpleCounterComponent, EmptyComponent]);

        assert.deepStrictEqual([simpleCounterComponent, simpleComponent], components);
      });
    });
  });

  describe('Hierarchy', () => {
    it('should call the onAddedToEntity method', () => {
      let pass = false;
      entity.addComponent(new class extends Component {
        onAddedToEntity(entity: Entity) {
          pass = true;
        }
      }());
      assert.isTrue(pass);
    });

    it('should remove the added component', () => {
      entity.addComponent(simpleCounterComponent);

      entity.removeComponent(SimpleCounterComponent);

      assert.equal(entity.getComponents().length, 0);
    });
  });

  describe('ID', () => {
    it('should have the same ID', () => {
      const firstEntity = new Entity();
      const secondEntity = new Entity();

      assert.notEqual(firstEntity.id, secondEntity.id);
    });
  });

  describe('Clone', () => {
    it('should have the same name', () => {
      const firstEntity = new Entity({ name: 'Clone test' });

      const clonedEntity = firstEntity.clone();

      assert.equal(clonedEntity.name, 'Clone test');
    });

    it('should have the same number of components', () => {
      const firstEntity = new Entity({ name: 'Clone test' });
      firstEntity.addComponent(new class A extends Component {
      }());
      firstEntity.addComponent(new class B extends Component {
      }());
      firstEntity.addComponent(new class C extends Component {
      }());

      const clonedEntity = firstEntity.clone();

      assert.equal(clonedEntity.getComponents().length, 3);
    });

    it('should have the same number of children', () => {
      const firstEntity = new Entity({ name: 'Clone test' });
      firstEntity.addChild(new Entity());
      firstEntity.addChild(new Entity());
      firstEntity.addChild(new Entity());

      const clonedEntity = firstEntity.clone();

      assert.equal(clonedEntity.children.length, 3);
    });
  });
});

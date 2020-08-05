import _Vue from "vue";
import Masonry from "masonry-layout";

const attributesMap: any = {
  "column-width": "columnWidth",
  "transition-duration": "transitionDuration",
  "item-selector": "itemSelector",
  "origin-left": "originLeft",
  "origin-top": "originTop",
  "fit-width": "fitWidth",
  stamp: "stamp",
  gutter: "gutter",
  "percent-position": "percentPosition",
  "horizontal-order": "horizontalOrder",
  stagger: "stagger",
  "destroy-delay": "destroyDelay"
};
const EVENT_ADD = "vuemasonry.itemAdded";
const EVENT_REMOVE = "vuemasonry.itemRemoved";
const EVENT_IMAGE_LOADED = "vuemasonry.imageLoaded";
const EVENT_DESTROY = "vuemasonry.destroy";

const stringToBool = function(val: any) {
  return (val + "").toLowerCase() === "true";
};

const numberOrSelector = function(val: any) {
  return isNaN(val) ? val : parseInt(val);
};

const collectOptions = function(attrs: any) {
  const res: any = {};
  const attributesArray: Array<string> = Array.prototype.slice.call(attrs);
  attributesArray.forEach(function(attr: any) {
    if (Object.keys(attributesMap).indexOf(attr.name) > -1) {
      if (attr.name.indexOf("origin") > -1) {
        res[attributesMap[attr.name]] = stringToBool(attr.value);
      } else if (attr.name === "column-width" || attr.name === "gutter") {
        res[attributesMap[attr.name]] = numberOrSelector(attr.value);
      } else {
        res[attributesMap[attr.name]] = attr.value;
      }
    }
  });
  return res;
};

export const VueMasonryPlugin = function() {};

VueMasonryPlugin.install = function(Vue: any, options: any) {
  const Events = new Vue({});
  const defaultId = "VueMasonry";

  Vue.directive("masonry", {
    props: ["transitionDuration", " itemSelector", "destroyDelay"],

    inserted: function(el: any, binding: any) {
      if (!Masonry) {
        throw new Error(
          "Masonry plugin is not defined. Please check it's connected and parsed correctly."
        );
      }
      const options = collectOptions(el.attributes);
      const masonry: any = new Masonry(el, options);
      const masonryId = binding.value || defaultId;
      const destroyDelay = options["destroyDelay"]
        ? parseInt(options["destroyDelay"], 10)
        : undefined;
      const masonryDraw = function() {
        masonry.reloadItems();
        masonry.layout();
      };
      Vue.nextTick(function() {
        masonryDraw();
      });

      const masonryRedrawHandler = function(eventData: any) {
        masonryDraw();
      };

      const masonryDestroyHandler = function(eventData: any) {
        Events.$off(`${EVENT_ADD}__${masonryId}`, masonryRedrawHandler);
        Events.$off(`${EVENT_REMOVE}__${masonryId}`, masonryRedrawHandler);
        Events.$off(
          `${EVENT_IMAGE_LOADED}__${masonryId}`,
          masonryRedrawHandler
        );
        Events.$off(`${EVENT_DESTROY}__${masonryId}`, masonryDestroyHandler);
        const delay =
          destroyDelay && !Number.isNaN(destroyDelay) ? destroyDelay : 0;
        setTimeout(function() {
          masonry.destroy();
        }, delay);
      };

      Events.$on(`${EVENT_ADD}__${masonryId}`, masonryRedrawHandler);
      Events.$on(`${EVENT_REMOVE}__${masonryId}`, masonryRedrawHandler);
      Events.$on(`${EVENT_IMAGE_LOADED}__${masonryId}`, masonryRedrawHandler);
      Events.$on(`${EVENT_DESTROY}__${masonryId}`, masonryDestroyHandler);
    },
    unbind: function(el: any, binding: any) {
      const masonryId = binding.value || defaultId;
      Events.$emit(`${EVENT_DESTROY}__${masonryId}`);
    }
  });

  Vue.directive("masonryTile", {
    inserted: function(el: any, binding: any) {
      const masonryId = binding.value || defaultId;
      Events.$emit(`${EVENT_ADD}__${masonryId}`, {
        element: el
      });
      // eslint-disable-next-line
      // new ImageLoaded(el, function () {
      //   Events.$emit(`${EVENT_IMAGE_LOADED}__${masonryId}`, {
      //     'element': el
      //   })
      // })
    },
    unbind: function(el: any, binding: any) {
      const masonryId = binding.value || defaultId;
      Events.$emit(`${EVENT_REMOVE}__${masonryId}`, {
        element: el
      });
    }
  });

  Vue.prototype.$redrawVueMasonry = function(id: any) {
    const masonryId = id || defaultId;
    Events.$emit(`${EVENT_ADD}__${masonryId}`);
  };
};

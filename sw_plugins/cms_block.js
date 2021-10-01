/* eslint-disable */
import template from '.${twigFName}';
import '.${cssFName}';

Shopware.Component.register('sw-cms-block-${name}', {
  template
});

Shopware.Service('cmsService').registerCmsBlock(${
  JSON.stringify({name,category,label,slots,component},null,2)
});
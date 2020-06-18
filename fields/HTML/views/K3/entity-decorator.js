'use strict';

import { CompositeDecorator } from 'draft-js';
import annotationDecorator from './annotation/annotation-decorator';
import linkDecorator from './link/link-decorator';
import quoteDecorator from './quote/quote-decorator';

const decorator = new CompositeDecorator([annotationDecorator, linkDecorator, quoteDecorator]);

export default decorator;

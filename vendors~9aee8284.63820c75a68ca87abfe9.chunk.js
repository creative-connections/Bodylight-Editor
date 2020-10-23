(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{fd9Y:function(_,n,t){"use strict";t.r(n),t.d(n,"configure",(function(){return V})),t.d(n,"DfValueConverter",(function(){return M})),t.d(n,"DfBindingBehavior",(function(){return O})),t.d(n,"NfValueConverter",(function(){return B})),t.d(n,"NfBindingBehavior",(function(){return C})),t.d(n,"RtValueConverter",(function(){return A})),t.d(n,"RtBindingBehavior",(function(){return N})),t.d(n,"TValueConverter",(function(){return T})),t.d(n,"TBindingBehavior",(function(){return y})),t.d(n,"TCustomAttribute",(function(){return j})),t.d(n,"TParamsCustomAttribute",(function(){return k})),t.d(n,"I18N_EA_SIGNAL",(function(){return m})),t.d(n,"I18N",(function(){return p})),t.d(n,"RelativeTime",(function(){return z})),t.d(n,"Backend",(function(){return L}));var o=t("jKim"),e=t("KKpb"),a=t("OeXm"),u=t("SkM8"),i=t("SGXf"),r=t("xIXs"),c=t("aurelia-framework"),l=t("aurelia-templating-resources"),s=t("aurelia-event-aggregator"),d=t("NDtI");
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
function g(_,n,t,o){var e,a=arguments.length,u=a<3?n:null===o?o=Object.getOwnPropertyDescriptor(n,t):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)u=Reflect.decorate(_,n,t,o);else for(var i=_.length-1;i>=0;i--)(e=_[i])&&(u=(a<3?e(u):a>3?e(n,t,u):e(n,t))||u);return a>3&&u&&Object.defineProperty(n,t,u),u}function h(_,n,t,o){return new(t||(t=Promise))((function(e,a){function u(_){try{r(o.next(_))}catch(_){a(_)}}function i(_){try{r(o.throw(_))}catch(_){a(_)}}function r(_){_.done?e(_.value):new t((function(n){n(_.value)})).then(u,i)}r((o=o.apply(_,n||[])).next())}))}const m="i18n:locale:changed";class p{constructor(_,n){this.ea=_,this.signaler=n,this.globalVars={},this.i18next=o.a,this.Intl=r.PLATFORM.global.Intl}static inject(){return[s.EventAggregator,l.a]}setup(_){return h(this,void 0,void 0,(function*(){const n={skipTranslationOnMissingKey:!1,compatibilityJSON:"v1",lng:"en",attributes:["t","i18n"],fallbackLng:"en",debug:!1};return this.i18nextDeferred=new Promise((t,o)=>{this.i18next.init(_||n,_=>{_&&!Array.isArray(_)&&o(_),this.i18next.options.attributes instanceof String&&(this.i18next.options.attributes=[this.i18next.options.attributes]),t(this.i18next)})}),this.i18nextDeferred}))}i18nextReady(){return this.i18nextDeferred}setLocale(_){return new Promise((n,t)=>{const o=this.getLocale();this.i18next.changeLanguage(_,(e,a)=>{e&&t(e),this.ea.publish(m,{oldValue:o,newValue:_}),this.signaler.signal("aurelia-translation-signal"),n(a)})})}getLocale(){return this.i18next.language}nf(_,n){return new this.Intl.NumberFormat(n||this.getLocale(),_||{})}uf(_,n){const t=this.nf({},n||this.getLocale()).format(1e4/3);let o=t[1];const e=t[5];"."===o&&(o="\\.");const a=_.replace(new RegExp(o,"g"),"").replace(/[^\d.,-]/g,"").replace(e,".");return Number(a)}df(_,n){return new this.Intl.DateTimeFormat(n||this.getLocale(),_)}tr(_,n){let t=this.globalVars;return void 0!==n&&(t=Object.assign(Object.assign({},this.globalVars),n)),this.i18next.t(_,t)}registerGlobalVariable(_,n){this.globalVars[_]=n}unregisterGlobalVariable(_){delete this.globalVars[_]}updateTranslations(_){if(!_||!_.querySelectorAll)return;let n,t;const o=this.i18next.options.attributes;let e=[].concat(o);for(n=0,t=e.length;n<t;n++)e[n]="["+e[n]+"]";e=e.join(",");const a=_.querySelectorAll(e);for(n=0,t=a.length;n<t;n++){const _=a[n];let t,e;for(let n=0,a=o.length;n<a;n++){t=_.getAttribute(o[n]);const a=o[n]+"-params";if(a&&_.au&&_.au[a]&&(e=_.au[a].viewModel.value),t)break}t&&this.updateValue(_,t,e)}}updateValue(_,n,t){null==n&&(n="");const o=n.toString().split(";");let a=o.length;for(;a--;){let n=o[a];const u=/\[([a-z\-, ]*)\]/gi;let i,c="text";for("IMG"===_.nodeName&&(c="src");null!==(i=u.exec(n));)i.index===u.lastIndex&&u.lastIndex++,i&&(n=n.replace(i[0],""),c=i[1]);const l=c.split(",");let s=l.length;for(;s--;){c=l[s].trim(),_._textContent||(_._textContent=_.textContent),_._innerHTML||(_._innerHTML=_.innerHTML);const o=c.replace(/-([a-z])/g,(function(_){return _[1].toUpperCase()})),a=["prepend","append","text","html"],u=Object(e.getLogger)("i18n");if(a.indexOf(c)>-1&&_.au&&_.au.controller&&_.au.controller.viewModel&&o in _.au.controller.viewModel&&u.warn(`Aurelia I18N reserved attribute name\n\n  [${a.join(", ")}]\n\n  Your custom element has a bindable named ${c} which is a reserved word.\n\n  If you'd like Aurelia I18N to translate your bindable instead, please consider giving it another name.`),this.i18next.options.skipTranslationOnMissingKey&&this.tr(n,t)===n)return void u.warn("Couldn't find translation for key: "+n);switch(c){case"text":const e=r.DOM.createTextNode(this.tr(n,t));for(_._newChild&&_._newChild.parentNode===_&&_.removeChild(_._newChild),_._newChild=e;_.firstChild;)_.removeChild(_.firstChild);_.appendChild(_._newChild);break;case"prepend":const a=r.DOM.createElement("div");a.innerHTML=this.tr(n,t);for(let n=_.childNodes.length-1;n>=0;n--)_.childNodes[n]._prepended&&_.removeChild(_.childNodes[n]);for(let n=a.childNodes.length-1;n>=0;n--)a.childNodes[n]._prepended=!0,_.firstChild?_.insertBefore(a.childNodes[n],_.firstChild):_.appendChild(a.childNodes[n]);break;case"append":const u=r.DOM.createElement("div");u.innerHTML=this.tr(n,t);for(let n=_.childNodes.length-1;n>=0;n--)_.childNodes[n]._appended&&_.removeChild(_.childNodes[n]);for(;u.firstChild;)u.firstChild._appended=!0,_.appendChild(u.firstChild);break;case"html":_.innerHTML=this.tr(n,t);break;default:_.au&&_.au.controller&&_.au.controller.viewModel&&o in _.au.controller.viewModel?_.au.controller.viewModel[o]=this.tr(n,t):_.setAttribute(c,this.tr(n,t))}}}}}let y=class{constructor(_){this.signalBindingBehavior=_}static inject(){return[l.b]}bind(_,n){this.signalBindingBehavior.bind(_,n,"aurelia-translation-signal");const t=_.sourceExpression;if(t.rewritten)return;t.rewritten=!0;const o=t.expression;t.expression=new d.Y(o,"t",t.args,[o,...t.args])}unbind(_,n){this.signalBindingBehavior.unbind(_,n)}};var f;y=g([Object(d.bb)("t")],y);const v=Number.isInteger||function(_){return"number"==typeof _&&isFinite(_)&&Math.floor(_)===_};let b=f=class{constructor(_){this.key=_}static of(_){return new f(_)}get(_){return()=>_.hasResolver(this.key,!1)?_.get(this.key):null}};var w;b=f=g([Object(a.A)()],b);let k=w=class{constructor(_){this.element=_}static inject(){return[r.DOM.Element]}static configureAliases(_){i.d.getOrCreateOwn(i.d.resource,u.HtmlBehaviorResource,w).aliases=_}valueChanged(){}};var x;k=w=g([Object(u.customAttribute)("t-params")],k);let j=x=class{constructor(_,n,t,o){this.element=_,this.service=n,this.ea=t,this.lazyParams=o}static inject(){return[r.DOM.Element,p,s.EventAggregator,b.of(k)]}static configureAliases(_){i.d.getOrCreateOwn(i.d.resource,u.HtmlBehaviorResource,x).aliases=_}bind(){this.params=this.lazyParams(),this.params&&(this.params.valueChanged=(_,n)=>{this.paramsChanged(this.value,_,n)});const _=null!==this.params?this.params.value:void 0;this.subscription=this.ea.subscribe(m,()=>{this.service.updateValue(this.element,this.value,null!==this.params?this.params.value:void 0)}),this.service.updateValue(this.element,this.value,_)}paramsChanged(_,n){this.service.updateValue(this.element,_,n)}valueChanged(_){const n=null!==this.params?this.params.value:void 0;this.service.updateValue(this.element,_,n)}unbind(){this.subscription&&this.subscription.dispose()}};j=x=g([Object(u.customAttribute)("t")],j);let T=class{constructor(_){this.service=_}static inject(){return[p]}toView(_,n){return this.service.tr(_,n)}};T=g([Object(c.valueConverter)("t")],T);let C=class{constructor(_){this.signalBindingBehavior=_}static inject(){return[l.b]}bind(_,n){this.signalBindingBehavior.bind(_,n,"aurelia-translation-signal");const t=_.sourceExpression;if(t.rewritten)return;t.rewritten=!0;const o=t.expression;t.expression=new d.Y(o,"nf",t.args,[o,...t.args])}unbind(_,n){this.signalBindingBehavior.unbind(_,n)}};C=g([Object(d.bb)("nf")],C);let B=class{constructor(_){this.service=_}static inject(){return[p]}toView(_,n,t){if(null==_||"string"==typeof _&&""===_.trim())return _;if(n&&n instanceof Intl.NumberFormat&&"function"==typeof n.format)return n.format(_);return this.service.nf(n,t||this.service.getLocale()).format(_)}};B=g([Object(d.Lb)("nf")],B);let O=class{constructor(_){this.signalBindingBehavior=_}static inject(){return[l.b]}bind(_,n){this.signalBindingBehavior.bind(_,n,"aurelia-translation-signal");const t=_.sourceExpression;if(t.rewritten)return;t.rewritten=!0;const o=t.expression;t.expression=new d.Y(o,"df",t.args,[o,...t.args])}unbind(_,n){this.signalBindingBehavior.unbind(_,n)}};O=g([Object(d.bb)("df")],O);let M=class{constructor(_){this.service=_}static inject(){return[p]}toView(_,n,t){if(null==_||"string"==typeof _&&""===_.trim())return _;if("string"==typeof _&&isNaN(_)&&!v(_)&&(_=new Date(_)),n&&n instanceof Intl.DateTimeFormat&&"function"==typeof n.format)return n.format(_);return this.service.df(n,t||this.service.getLocale()).format(_)}};M=g([Object(d.Lb)("df")],M);let N=class{constructor(_){this.signalBindingBehavior=_}static inject(){return[l.b]}bind(_,n){this.signalBindingBehavior.bind(_,n,"aurelia-translation-signal","aurelia-relativetime-signal");const t=_.sourceExpression;if(t.rewritten)return;t.rewritten=!0;const o=t.expression;t.expression=new d.Y(o,"rt",t.args,[o,...t.args])}unbind(_,n){this.signalBindingBehavior.unbind(_,n)}};N=g([Object(d.bb)("rt")],N);const D={ar:{translation:{now:"الآن",second_ago:"قبل ثانية واحدة",second_ago_plural:"قبل __count__ ثانية",second_in:"خلال ثانية واحدة",second_in_plural:"خلال __count__ ثانية",minute_ago:"قبل دقيقة واحدة",minute_ago_plural:"قبل __count__ دقيقة",minute_in:"خلال دقيقة واحدة",minute_in_plural:"خلال __count__ دقيقة",hour_ago:"قبل ساعة واحدة",hour_ago_plural:"قبل __count__ ساعة",hour_in:"خلال ساعة واحدة",hour_in_plural:"خلال __count__ ساعة",day_ago:"قبل يوم واحد",day_ago_plural:"قبل __count__ يومًا",day_in:"خلال يوم واحد",day_in_plural:"خلال __count__ يومًا",month_ago:"قبل شهر واحد",month_ago_plural:"قبل __count__ شهرًا",month_in:"خلال شهر واحد",month_in_plural:"خلال __count__ شهرًا",year_ago:"قبل سنة واحدة",year_ago_plural:"قبل __count__ سنة",year_in:"خلال سنة واحدة",year_in_plural:"خلال __count__ سنة"}},da:{translation:{now:"nu",second_ago:"for __count__ sekund siden",second_ago_plural:"for __count__ sekunder siden",second_in:"om __count__ sekund",second_in_plural:"om __count__ sekunder",minute_ago:"for __count__ minut siden",minute_ago_plural:"for __count__ minutter siden",minute_in:"om __count__ minut",minute_in_plural:"om __count__ minutter",hour_ago:"for __count__ time siden",hour_ago_plural:"for __count__ timer siden",hour_in:"om __count__ time",hour_in_plural:"om __count__ timer",day_ago:"for __count__ dag siden",day_ago_plural:"for __count__ dage siden",day_in:"om __count__ dag",day_in_plural:"om __count__ dage",month_ago:"for __count__ måned siden",month_ago_plural:"for __count__ måneder siden",month_in:"om __count__ måned",month_in_plural:"om __count__ måneder",year_ago:"for __count__ år siden",year_ago_plural:"for __count__ år siden",year_in:"om __count__ år",year_in_plural:"om __count__ år"}},de:{translation:{now:"jetzt",second_ago:"vor __count__ Sekunde",second_ago_plural:"vor __count__ Sekunden",second_in:"in __count__ Sekunde",second_in_plural:"in __count__ Sekunden",minute_ago:"vor __count__ Minute",minute_ago_plural:"vor __count__ Minuten",minute_in:"in __count__ Minute",minute_in_plural:"in __count__ Minuten",hour_ago:"vor __count__ Stunde",hour_ago_plural:"vor __count__ Stunden",hour_in:"in __count__ Stunde",hour_in_plural:"in __count__ Stunden",day_ago:"vor __count__ Tag",day_ago_plural:"vor __count__ Tagen",day_in:"in __count__ Tag",day_in_plural:"in __count__ Tagen",month_ago:"vor __count__ Monat",month_ago_plural:"vor __count__ Monaten",month_in:"in __count__ Monat",month_in_plural:"in __count__ Monaten",year_ago:"vor __count__ Jahr",year_ago_plural:"vor __count__ Jahren",year_in:"in __count__ Jahr",year_in_plural:"in __count__ Jahren"}},en:{translation:{now:"now",second_ago:"__count__ second ago",second_ago_plural:"__count__ seconds ago",second_in:"in __count__ second",second_in_plural:"in __count__ seconds",minute_ago:"__count__ minute ago",minute_ago_plural:"__count__ minutes ago",minute_in:"in __count__ minute",minute_in_plural:"in __count__ minutes",hour_ago:"__count__ hour ago",hour_ago_plural:"__count__ hours ago",hour_in:"in __count__ hour",hour_in_plural:"in __count__ hours",day_ago:"__count__ day ago",day_ago_plural:"__count__ days ago",day_in:"in __count__ day",day_in_plural:"in __count__ days",month_ago:"__count__ month ago",month_ago_plural:"__count__ months ago",month_in:"in __count__ month",month_in_plural:"in __count__ months",year_ago:"__count__ year ago",year_ago_plural:"__count__ years ago",year_in:"in __count__ year",year_in_plural:"in __count__ years"}},es:{translation:{now:"ahora",second_ago:"hace __count__ segundo",second_ago_plural:"hace __count__ segundos",second_in:"dentro de __count__ segundo",second_in_plural:"dentro de __count__ segundos",minute_ago:"hace __count__ minuto",minute_ago_plural:"hace __count__ minutos",minute_in:"dentro de __count__ minuto",minute_in_plural:"dentro de __count__ minutos",hour_ago:"hace __count__ hora",hour_ago_plural:"hace __count__ horas",hour_in:"dentro de __count__ hora",hour_in_plural:"dentro de __count__ horas",day_ago:"hace __count__ día",day_ago_plural:"hace __count__ días",day_in:"dentro de __count__ día",day_in_plural:"dentro de __count__ días",month_ago:"hace __count__ mes",month_ago_plural:"hace __count__ meses",month_in:"dentro de __count__ mes",month_in_plural:"dentro de __count__ meses",year_ago:"hace __count__ año",year_ago_plural:"hace __count__ años",year_in:"dentro de __count__ año",year_in_plural:"dentro de __count__ años"}},fi:{translation:{now:"nyt",second_ago:"__count__ sekunti sitten",second_ago_plural:"__count__ sekuntia sitten",second_in:"__count__ sekunnin päästä",second_in_plural:"__count__ sekunnin päästä",minute_ago:"__count__ minuutti sitten",minute_ago_plural:"__count__ minuuttia sitten",minute_in:"__count__ minuutin päästä",minute_in_plural:"__count__ minuutin päästä",hour_ago:"__count__ tunti sitten",hour_ago_plural:"__count__ tuntia sitten",hour_in:"__count__ tunnin päästä",hour_in_plural:"__count__ tunnin päästä",day_ago:"__count__ päivä sitten",day_ago_plural:"__count__ päivää sitten",day_in:"__count__ päivän päästä",day_in_plural:"__count__ päivän päästä",month_ago:"__count__ kuukausi sitten",month_ago_plural:"__count__ kuukautta sitten",month_in:"__count__ kuukauden päästä",month_in_plural:"__count__ kuukauden päästä",year_ago:"__count__ vuosi sitten",year_ago_plural:"__count__ vuotta sitten",year_in:"__count__ vuoden päästä",year_in_plural:"__count__ vuoden päästä"}},fr:{translation:{now:"maintenant",second_ago:"il y a __count__ seconde",second_ago_plural:"il y a __count__ secondes",second_in:"dans __count__ seconde",second_in_plural:"dans __count__ secondes",minute_ago:"il y a __count__ minute",minute_ago_plural:"il y a __count__ minutes",minute_in:"dans __count__ minute",minute_in_plural:"dans __count__ minutes",hour_ago:"il y a __count__ heure",hour_ago_plural:"il y a __count__ heures",hour_in:"dans __count__ heure",hour_in_plural:"dans __count__ heures",day_ago:"il y a __count__ jour",day_ago_plural:"il y a __count__ jours",day_in:"dans __count__ jour",day_in_plural:"dans __count__ jours",month_ago:"il y a __count__ mois",month_ago_plural:"il y a __count__ mois",month_in:"dans __count__ mois",month_in_plural:"dans __count__ mois",year_ago:"il y a __count__ an",year_ago_plural:"il y a __count__ ans",year_in:"dans __count__ an",year_in_plural:"dans __count__ ans"}},it:{translation:{now:"ora",second_ago:"__count__ secondo fa",second_ago_plural:"__count__ secondi fa",second_in:"tra __count__ secondo",second_in_plural:"tra __count__ secondi",minute_ago:"__count__ minuto fa",minute_ago_plural:"__count__ minuti fa",minute_in:"tra __count__ minuto",minute_in_plural:"tra __count__ minuti",hour_ago:"__count__ ora fa",hour_ago_plural:"__count__ ore fa",hour_in:"tra __count__ ora",hour_in_plural:"tra __count__ ore",day_ago:"__count__ giorno fa",day_ago_plural:"__count__ giorni fa",day_in:"tra __count__ giorno",day_in_plural:"tra __count__ giorni",month_ago:"__count__ mese fa",month_ago_plural:"__count__ mesi fa",month_in:"tra __count__ mese",month_in_plural:"tra __count__ mesi",year_ago:"__count__ anno fa",year_ago_plural:"__count__ anni fa",year_in:"tra __count__ anno",year_in_plural:"tra __count__ anni"}},ja:{translation:{now:"今",second_ago:"__count__ 秒前",second_ago_plural:"__count__ 秒前",second_in:"__count__ 秒後",second_in_plural:"__count__ 秒後",minute_ago:"__count__ 分前",minute_ago_plural:"__count__ 分前",minute_in:"__count__ 分後",minute_in_plural:"__count__ 分後",hour_ago:"__count__ 時間前",hour_ago_plural:"__count__ 時間前",hour_in:"__count__ 時間後",hour_in_plural:"__count__ 時間後",day_ago:"__count__ 日前",day_ago_plural:"__count__ 日前",day_in:"__count__ 日後",day_in_plural:"__count__ 日後",month_ago:"__count__ か月前",month_ago_plural:"__count__ か月前",month_in:"__count__ か月後",month_in_plural:"__count__ か月後",year_ago:"__count__ 年前",year_ago_plural:"__count__ 年前",year_in:"__count__ 年後",year_in_plural:"__count__ 年後"}},lt:{translation:{now:"dabar",second_ago:"prieš __count__ sekundę",second_ago_plural:"prieš __count__ sekundes",second_in:"po __count__ sekundės",second_in_plural:"po __count__ sekundžių",minute_ago:"prieš __count__ minutę",minute_ago_plural:"prieš __count__ minutes",minute_in:"po __count__ minutės",minute_in_plural:"po __count__ minučių",hour_ago:"prieš __count__ valandą",hour_ago_plural:"prieš __count__ valandas",hour_in:"po __count__ valandos",hour_in_plural:"po __count__ valandų",day_ago:"prieš __count__ dieną",day_ago_plural:"prieš __count__ dienas",day_in:"po __count__ dienos",day_in_plural:"po __count__ dienų",month_ago:"prieš __count__ mėnesį",month_ago_plural:"prieš __count__ mėnesius",month_in:"po __count__ mėnesio",month_in_plural:"po __count__ mėnesių",year_ago:"prieš __count__ metus",year_ago_plural:"prieš __count__ metus",year_in:"po __count__ metų",year_in_plural:"po __count__ metų"}},nl:{translation:{now:"nu",second_ago:"__count__ seconde geleden",second_ago_plural:"__count__ seconden geleden",second_in:"over __count__ seconde",second_in_plural:"over __count__ seconden",minute_ago:"__count__ minuut geleden",minute_ago_plural:"__count__ minuten geleden",minute_in:"over __count__ minuut",minute_in_plural:"over __count__ minuten",hour_ago:"__count__ uur geleden",hour_ago_plural:"__count__ uur geleden",hour_in:"over __count__ uur",hour_in_plural:"over __count__ uur",day_ago:"__count__ dag geleden",day_ago_plural:"__count__ dagen geleden",day_in:"over __count__ dag",day_in_plural:"over __count__ dagen",month_ago:"__count__ maand geleden",month_ago_plural:"__count__ maanden geleden",month_in:"over __count__ maand",month_in_plural:"over __count__ maanden",year_ago:"__count__ jaar geleden",year_ago_plural:"__count__ jaar geleden",year_in:"over __count__ jaar",year_in_plural:"over __count__ jaar"}},nn:{translation:{now:"no",second_ago:"for __count__ sekund sidan",second_ago_plural:"for __count__ sekund sidan",second_in:"om __count__ sekund",second_in_plural:"om __count__ sekund",minute_ago:"for __count__ minutt sidan",minute_ago_plural:"for __count__ minutt sidan",minute_in:"om __count__ minutt",minute_in_plural:"om __count__ minutt",hour_ago:"for __count__ time sidan",hour_ago_plural:"for __count__ timar sidan",hour_in:"om __count__ time",hour_in_plural:"om __count__ timar",day_ago:"for __count__ døgn sidan",day_ago_plural:"for __count__ døgn sidan",day_in:"om __count__ døgn",day_in_plural:"om __count__ døgn",month_ago:"for __count__ månad sidan",month_ago_plural:"for __count__ månadar sidan",month_in:"om __count__ månad",month_in_plural:"om __count__ månadar",year_ago:"for __count__ år sidan",year_ago_plural:"for __count__ år sidan",year_in:"om __count__ år",year_in_plural:"om __count__ år"}},nb:{translation:{now:"nå",second_ago:"for __count__ sekund siden",second_ago_plural:"for __count__ sekunder siden",second_in:"om __count__ sekund",second_in_plural:"om __count__ sekunder",minute_ago:"for __count__ minutt siden",minute_ago_plural:"for __count__ minutter siden",minute_in:"om __count__ minutt",minute_in_plural:"om __count__ minutter",hour_ago:"for __count__ time siden",hour_ago_plural:"for __count__ timer siden",hour_in:"om __count__ time",hour_in_plural:"om __count__ timer",day_ago:"for __count__ døgn siden",day_ago_plural:"for __count__ døgn siden",day_in:"om __count__ døgn",day_in_plural:"om __count__ døgn",month_ago:"for __count__ måned siden",month_ago_plural:"for __count__ måneder siden",month_in:"om __count__ måned",month_in_plural:"om __count__ måneder",year_ago:"for __count__ år siden",year_ago_plural:"for __count__ år siden",year_in:"om __count__ år",year_in_plural:"om __count__ år"}},pl:{translation:{now:"teraz",second_ago:"__count__ sekundę temu",second_ago_plural:"__count__ sekundy temu",second_in:"za __count__ sekundę",second_in_plural:"za __count__ sekundy",minute_ago:"__count__ minutę temu",minute_ago_plural:"__count__ minuty temu",minute_in:"za __count__ minutę",minute_in_plural:"za __count__ minuty",hour_ago:"__count__ godzinę temu",hour_ago_plural:"__count__ godziny temu",hour_in:"za __count__ godzinę",hour_in_plural:"za __count__ godziny",day_ago:"__count__ dzień temu",day_ago_plural:"__count__ dni temu",day_in:"za __count__ dzień",day_in_plural:"za __count__ dni",month_ago:"__count__ miesiąc temu",month_ago_plural:"__count__ miesiące temu",month_in:"za __count__ miesiąc",month_in_plural:"za __count__ miesiące",year_ago:"__count__ rok temu",year_ago_plural:"__count__ lata temu",year_in:"za __count__ rok",year_in_plural:"za __count__ lata"}},pt:{translation:{now:"agora",second_ago:"há __count__ segundo",second_ago_plural:"há __count__ segundos",second_in:"em __count__ segundo",second_in_plural:"em __count__ segundos",minute_ago:"há __count__ minuto",minute_ago_plural:"há __count__ minutos",minute_in:"em __count__ minuto",minute_in_plural:"em __count__ minutos",hour_ago:"há __count__ hora",hour_ago_plural:"há __count__ horas",hour_in:"em __count__ hora",hour_in_plural:"em __count__ horas",day_ago:"há __count__ dia",day_ago_plural:"há __count__ dias",day_in:"em __count__ dia",day_in_plural:"em __count__ dias",month_ago:"há __count__ mês",month_ago_plural:"há __count__ meses",month_in:"em __count__ mês",month_in_plural:"em __count__ meses",year_ago:"há __count__ ano",year_ago_plural:"há __count__ anos",year_in:"em __count__ ano",year_in_plural:"em __count__ anos"}},sv:{translation:{now:"nu",second_ago:"för __count__ sekund sedan",second_ago_plural:"för __count__ sekunder sedan",second_in:"om __count__ sekund",second_in_plural:"om __count__ sekunder",minute_ago:"för __count__ minut sedan",minute_ago_plural:"för __count__ minuter sedan",minute_in:"om __count__ minut",minute_in_plural:"om __count__ minuter",hour_ago:"för __count__ timme sedan",hour_ago_plural:"för __count__ timmar sedan",hour_in:"om __count__ timme",hour_in_plural:"om __count__ timmar",day_ago:"för __count__ dag sedan",day_ago_plural:"för __count__ dagar sedan",day_in:"om __count__ dag",day_in_plural:"om __count__ dagar",month_ago:"för __count__ månad sedan",month_ago_plural:"för __count__ månader sedan",month_in:"om __count__ månad",month_in_plural:"om __count__ månader",year_ago:"för __count__ år sedan",year_ago_plural:"för __count__ år sedan",year_in:"om __count__ år",year_in_plural:"om __count__ år"}},th:{translation:{now:"ขณะนี้",second_ago:"__count__ วินาทีที่ผ่านมา",second_ago_plural:"__count__ วินาทีที่ผ่านมา",second_in:"ในอีก __count__ วินาที",second_in_plural:"ในอีก __count__ วินาที",minute_ago:"__count__ นาทีที่ผ่านมา",minute_ago_plural:"__count__ นาทีที่ผ่านมา",minute_in:"ในอีก __count__ นาที",minute_in_plural:"ในอีก __count__ นาที",hour_ago:"__count__ ชั่วโมงที่ผ่านมา",hour_ago_plural:"__count__ ชั่วโมงที่ผ่านมา",hour_in:"ในอีก __count__ ชั่วโมง",hour_in_plural:"ในอีก __count__ ชั่วโมง",day_ago:"__count__ วันที่ผ่านมา",day_ago_plural:"__count__ วันที่ผ่านมา",day_in:"ในอีก __count__ วัน",day_in_plural:"ในอีก __count__ วัน",month_ago:"__count__ เดือนที่ผ่านมา",month_ago_plural:"__count__ เดือนที่ผ่านมา",month_in:"ในอีก __count__ เดือน",month_in_plural:"ในอีก __count__ เดือน",year_ago:"__count__ ปีที่แล้ว",year_ago_plural:"__count__ ปีที่แล้ว",year_in:"ในอีก __count__ ปี",year_in_plural:"ในอีก __count__ ปี"}},zh:{translation:{now:"现在",second_ago:"__count__秒钟前",second_ago_plural:"__count__秒钟前",second_in:"__count__秒钟后",second_in_plural:"__count__秒钟后",minute_ago:"__count__分钟前",minute_ago_plural:"__count__分钟前",minute_in:"__count__分钟后",minute_in_plural:"__count__分钟后",hour_ago:"__count__小时前",hour_ago_plural:"__count__小时前",hour_in:"__count__小时后",hour_in_plural:"__count__小时后",day_ago:"__count__天前",day_ago_plural:"__count__天前",day_in:"__count__天后",day_in_plural:"__count__天后",month_ago:"__count__个月前",month_ago_plural:"__count__个月前",month_in:"__count__个月后",month_in_plural:"__count__个月后",year_ago:"__count__年前",year_ago_plural:"__count__年前",year_in:"__count__年后",year_in_plural:"__count__年后"}},"zh-HK":{translation:{now:"現在",second_ago:"__count__ 秒前",second_ago_plural:"__count__ 秒前",second_in:"__count__ 秒後",second_in_plural:"__count__ 秒後",minute_ago:"__count__ 分鐘前",minute_ago_plural:"__count__ 分鐘前",minute_in:"__count__ 分鐘後",minute_in_plural:"__count__ 分鐘後",hour_ago:"__count__ 小時前",hour_ago_plural:"__count__ 小時前",hour_in:"__count__ 小時後",hour_in_plural:"__count__ 小時後",day_ago:"__count__ 日前",day_ago_plural:"__count__ 日前",day_in:"__count__ 日後",day_in_plural:"__count__ 日後",month_ago:"__count__ 個月前",month_ago_plural:"__count__ 個月前",month_in:"__count__ 個月後",month_in_plural:"__count__ 個月後",year_ago:"__count__ 年前",year_ago_plural:"__count__ 年前",year_in:"__count__ 年後",year_in_plural:"__count__ 年後"}},"zh-TW":{translation:{now:"剛才",second_ago:"__count__ 秒鐘前",second_ago_plural:"__count__ 秒鐘前",second_in:"__count__ 秒內",second_in_plural:"__count__ 秒內",minute_ago:"__count__ 分鐘前",minute_ago_plural:"__count__ 分鐘前",minute_in:"__count__ 分鐘內",minute_in_plural:"__count__ 分鐘內",hour_ago:"__count__ 小時前",hour_ago_plural:"__count__ 小時前",hour_in:"__count__ 小時內",hour_in_plural:"__count__ 小時內",day_ago:"__count__ 天前",day_ago_plural:"__count__ 天前",day_in:"__count__ 天內",day_in_plural:"__count__ 天內",month_ago:"__count__ 月前",month_ago_plural:"__count__ 月前",month_in:"__count__ 月內",month_in_plural:"__count__ 月內",year_ago:"__count__ 年前",year_ago_plural:"__count__ 年前",year_in:"__count__ 年內",year_in_plural:"__count__ 年內"}}};class z{constructor(_,n){this.service=_,this.ea=n,this.service.i18nextReady().then(()=>{this.setup()}),this.ea.subscribe(m,_=>{this.setup(_)})}static inject(){return[p,s.EventAggregator]}setup(_){const n=D,t=this.service.i18next.fallbackLng;let o=t||this.service.i18next.options.fallbackLng;Array.isArray(o)&&o.length>0&&(o=o[0]);const e=(_&&_.newValue?_.newValue:this.service.getLocale())||o;let a=0;if((a=e.indexOf("-"))>=0){const _=e.substring(0,a);n[_]&&this.addTranslationResource(_,n[_].translation)}n[e]&&this.addTranslationResource(e,n[e].translation),n[t]&&this.addTranslationResource(e,n[t].translation)}addTranslationResource(_,n){const t=this.service.i18next.options;if(t.interpolation&&("__"!==t.interpolation.prefix||"__"!==t.interpolation.suffix))for(const _ in n)n[_]=n[_].replace("__count__",`${t.interpolation.prefix||"{{"}count${t.interpolation.suffix||"}}"}`);this.service.i18next.addResources(_,t.defaultNS||"translation",n)}getRelativeTime(_){const n=(new Date).getTime()-_.getTime();let t=this.getTimeDiffDescription(n,"year",31104e6);return t||(t=this.getTimeDiffDescription(n,"month",2592e6),t||(t=this.getTimeDiffDescription(n,"day",864e5),t||(t=this.getTimeDiffDescription(n,"hour",36e5),t||(t=this.getTimeDiffDescription(n,"minute",6e4),t||(t=this.getTimeDiffDescription(n,"second",1e3),t||(t=this.service.tr("now"))))))),t}getTimeDiffDescription(_,n,t){const o=parseInt((_/t).toFixed(0),10);if(o>0)return this.service.tr(n,{count:o,context:"ago"});if(o<0){const _=Math.abs(o);return this.service.tr(n,{count:_,context:"in"})}return null}}let A=class{constructor(_){this.service=_}static inject(){return[z]}toView(_){return null==_||"string"==typeof _&&""===_.trim()?_:("string"==typeof _&&isNaN(_)&&!Number.isInteger(_)&&(_=new Date(_)),this.service.getRelativeTime(_))}};A=g([Object(d.Lb)("rt")],A);class L{constructor(_,n={}){this.services=_,this.options=n,this.type="backend",this.init(_,n)}static with(_){return this.loader=_,this}init(_,n={}){this.services=_,this.options=Object.assign({},{loadPath:"/locales/{{lng}}/{{ns}}.json",addPath:"locales/add/{{lng}}/{{ns}}",allowMultiLoading:!1,parse:JSON.parse},n)}readMulti(_,n,t){let o=this.options.loadPath;"function"==typeof this.options.loadPath&&(o=this.options.loadPath(_,n));const e=this.services.interpolator.interpolate(o,{lng:_.join("+"),ns:n.join("+")});this.loadUrl(e,t)}read(_,n,t){let o=this.options.loadPath;"function"==typeof this.options.loadPath&&(o=this.options.loadPath([_],[n]));const e=this.services.interpolator.interpolate(o,{lng:_,ns:n});this.loadUrl(e,t)}loadUrl(_,n){return h(this,void 0,void 0,(function*(){try{const t=yield L.loader.loadText(_);let o,e;try{o=t instanceof Object?t:this.options.parse(t,_)}catch(n){e="failed parsing "+_+" to json"}if(e)return n(e,!1);n(null,o)}catch(t){n("failed loading "+_,!1)}}))}create(_,n,t,o){}}function V(_,n){if("function"!=typeof n){throw"You need to provide a callback method to properly configure the library"}const t=_.container.get(p),o=n(t);return _.globalResources([T,y,j,k,B,C,M,O,A,N]),_.postTask(()=>{const n=_.container.get(u.ViewResources),o=n.getAttribute("t"),e=n.getAttribute("t-params");let a=t.i18next.options.attributes;a||(a=["t","i18n"]),a.forEach(_=>n.registerAttribute(_,o,"t")),a.forEach(_=>n.registerAttribute(_+"-params",e,"t-params"))}),o}L.type="backend"}}]);
//# sourceMappingURL=vendors~9aee8284.63820c75a68ca87abfe9.bundle.map
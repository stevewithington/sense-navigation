/*!

* sense-navigation - Sense Sheet Navigation + Actions visualization extension for Qlik Sense.
* --
* @version v0.8.3
* @link https://github.com/stefanwalther/sense-navigation
* @author Stefan Walther
* @license MIT
*/

define(["jquery","underscore","qlik","./lib/external/sense-extension-utils/extUtils","ng!$q","ng!$http"],function($,_,qlik,extUtils,$q,$http){var app=qlik.currApp();var actionOptions=[{value:"none",label:"None"},{value:"applyBookmark",label:"Apply Bookmark"},{value:"clearAll",label:"Clear All Selections"},{value:"clearField",label:"Clear Selection in Field"},{value:"lockField",label:"Lock Field"},{value:"selectExcluded",label:"Select Excluded Values"},{value:"selectAlternative",label:"Select Alternative Values"},{value:"selectandLockField",label:"Select and Lock in Field"},{value:"selectField",label:"Select Value in Field"},{value:"selectValues",label:"Select Multiple Values in Field"},{value:"setVariable",label:"Set Variable Value"},{value:"lockAll",label:"Lock All Selections"},{value:"unlockAll",label:"Unlock All Selections"}],fieldEnabler=["selectField","selectValues","clearField","selectandLockField","lockField","selectAlternative","selectExcluded"],bookmarkEnabler=["applyBookmark"],variableEnabler=["setVariable"],valueEnabler=["selectField","selectValues","setVariable","selectandLockField"],valueDescEnabler=["selectValues"],bookmark1Enabler=["applyBookmark"],softLockEnabler=["selectAlternative","selectExcluded"];return{type:"items",component:"accordion",items:{settings:{uses:"settings",items:{general:{items:{showTitles:{defaultValue:!1}}},layout:{type:"items",label:"Layout",items:{label:{ref:"props.buttonLabel",label:"Label",type:"string",expression:"optional",show:function(){return!0},defaultValue:"My Button"},style:{type:"string",component:"dropdown",ref:"props.buttonStyle",label:"Style",defaultValue:"default",options:[{value:"default",label:"Default"},{value:"primary",label:"Primary"},{value:"success",label:"Success"},{value:"info",label:"Info"},{value:"warning",label:"Warning"},{value:"danger",label:"Danger"},{value:"link",label:"Link"}]},buttonWidth:{type:"boolean",component:"buttongroup",label:"Button Width",ref:"props.fullWidth",options:[{value:!0,label:"Full Width",tooltip:"Button has the same width as the element."},{value:!1,label:"Auto Width",tooltip:"Auto width depending on the label defined."}],defaultValue:!1},align:{ref:"props.buttonAlign",label:"Alignment",type:"string",component:"dropdown",defaultValue:"left",options:[{value:"center",label:"Center"},{value:"left",label:"Left"},{value:"right",label:"Right"}],show:function(data){return!1===data.props.fullWidth}},buttonMultiLine:{ref:"props.isButtonMultiLine",label:"Multiline",type:"boolean",component:"switch",defaultValue:!1,options:[{value:!0,label:"Enabled"},{value:!1,label:"Disabled"}]},icons:{type:"string",component:"dropdown",label:"Icon",ref:"props.buttonIcon",options:function(){return function(){var defer=$q.defer();return $http.get(extUtils.getExtensionPath("swr-sense-navigation")+"/lib/data/icons-fa.json").then(function(res){var sortedIcons=_.sortBy(res.data.icons,function(o){return o.name}),propDef=[];propDef.push({value:"",label:">> No icon <<"}),sortedIcons.forEach(function(icon){propDef.push({value:icon.id,label:icon.name})}),defer.resolve(propDef)}),defer.promise}().then(function(items){return items})}}}},behavior:{type:"items",label:"Navigation Behavior",items:{action:{ref:"props.action",label:"Navigation Action",type:"string",component:"dropdown",default:"nextSheet",options:[{value:"none",label:"None"},{value:"nextSheet",label:"Go to next sheet"},{value:"prevSheet",label:"Go to previous sheet"},{value:"gotoSheet",label:"Go to a specific sheet"},{value:"gotoSheetById",label:"Go to a sheet (defined by Sheet Id)"},{value:"gotoStory",label:"Go to a story"},{value:"openWebsite",label:"Open website"}]},sheetId:{ref:"props.sheetId",label:"Sheet ID",type:"string",expression:"optional",show:function(data){return"gotoSheetById"===data.props.action}},sheetList:{type:"string",component:"dropdown",label:"Select Sheet",ref:"props.selectedSheet",options:function(){return function(){var defer=$q.defer();return app.getAppObjectList(function(data){var sheets=[],sortedData=_.sortBy(data.qAppObjectList.qItems,function(item){return item.qData.rank});return _.each(sortedData,function(item){sheets.push({value:item.qInfo.qId,label:item.qMeta.title})}),defer.resolve(sheets)}),defer.promise}().then(function(items){return items})},show:function(data){return"gotoSheet"===data.props.action}},storyList:{type:"string",component:"dropdown",label:"Select Story",ref:"props.selectedStory",options:function(){return function(){var defer=$q.defer();return app.getList("story",function(data){var stories=[];return data&&data.qAppObjectList&&data.qAppObjectList.qItems&&data.qAppObjectList.qItems.forEach(function(item){stories.push({value:item.qInfo.qId,label:item.qMeta.title})}),defer.resolve(_.sortBy(stories,function(item){return item.label}))}),defer.promise}().then(function(items){return items})},show:function(data){return"gotoStory"===data.props.action}},websiteUrl:{ref:"props.websiteUrl",label:"Website Url:",type:"string",expression:"optional",show:function(data){return"openWebsite"===data.props.action}},sameWindow:{ref:"props.sameWindow",label:"Open in same window",type:"boolean",defaultValue:!0,show:function(data){return"openWebsite"===data.props.action}}}},actionsBefore:{type:"items",label:"Actions",items:{isActionsBefore:{type:"boolean",component:"switch",label:"Actions before navigating",ref:"props.isActionsBefore",defaultValue:!1,options:[{value:!0,label:"Enabled"},{value:!1,label:"Disabled"}]},actionBefore1:{type:"string",component:"dropdown",label:"First Action",ref:"props.actionBefore1",defaultValue:"none",show:function(data){return data.props.isActionsBefore},options:actionOptions},field1:{type:"string",ref:"props.field1",label:"Field",expression:"optional",show:function(data){return fieldEnabler.indexOf(data.props.actionBefore1)>-1}},variable1:{type:"string",ref:"props.variable1",label:"Variable Name",expression:"optional",show:function(data){return variableEnabler.indexOf(data.props.actionBefore1)>-1}},value1:{type:"string",ref:"props.value1",label:"Value",expression:"optional",show:function(data){return valueEnabler.indexOf(data.props.actionBefore1)>-1}},value1Desc:{type:"text",component:"text",ref:"props.value1Desc",label:"Define multiple values separated with a semi-colon (;).",show:function(data){return valueDescEnabler.indexOf(data.props.actionBefore1)>-1}},bookmark1:{type:"string",component:"dropdown",label:"Select Bookmark",ref:"props.bookmark1",options:function(){return function(){var defer=$q.defer();return app.getList("BookmarkList",function(items){defer.resolve(items.qBookmarkList.qItems.map(function(item){return{value:item.qInfo.qId,label:item.qData.title}}))}),defer.promise}().then(function(items){return items})},show:function(data){return bookmark1Enabler.indexOf(data.props.actionBefore1)>-1}},softlock1:{type:"boolean",label:"Soft Lock",ref:"props.softlock1",defaultValue:!1,show:function(data){return softLockEnabler.indexOf(data.props.actionBefore1)>-1}},actionBefore2:{type:"string",component:"dropdown",label:"Second Action",ref:"props.actionBefore2",defaultValue:"none",show:function(data){return data.props.isActionsBefore&&"none"!==data.props.actionBefore1},options:actionOptions},field2:{type:"string",ref:"props.field2",label:"Field",expression:"optional",show:function(data){return fieldEnabler.indexOf(data.props.actionBefore2)>-1}},variable2:{type:"string",ref:"props.variable2",label:"Variable Name",expression:"optional",show:function(data){return variableEnabler.indexOf(data.props.actionBefore2)>-1}},value2:{type:"string",ref:"props.value2",label:"Value",expression:"optional",show:function(data){return valueEnabler.indexOf(data.props.actionBefore2)>-1}},value2Desc:{type:"string",component:"text",ref:"props.value2Desc",label:"Define multiple values separated with a semi-colon (;).",show:function(data){return valueDescEnabler.indexOf(data.props.actionBefore2)>-1}},bookmark2:{type:"string",ref:"props.bookmark2",label:"Bookmark Id",expression:"optional",show:function(data){return bookmarkEnabler.indexOf(data.props.actionBefore2)>-1}},softlock2:{type:"boolean",label:"Soft Lock",ref:"props.softlock2",defaultValue:!1,show:function(data){return softLockEnabler.indexOf(data.props.actionBefore2)>-1}}}}}}}}});
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/ 	
/******/ 	function hotDisposeChunk(chunkId) { //eslint-disable-line no-unused-vars
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "555ed405b52cf5b186c3"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(19)(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./build/assets.json":
/***/ (function(module, exports) {

eval("module.exports = {\n\t\"client\": {\n\t\t\"js\": \"http://localhost:3001/static/js/client.js\"\n\t}\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9idWlsZC9hc3NldHMuanNvbi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2J1aWxkL2Fzc2V0cy5qc29uP2Q2ZjkiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiY2xpZW50XCI6IHtcblx0XHRcImpzXCI6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAxL3N0YXRpYy9qcy9jbGllbnQuanNcIlxuXHR9XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYnVpbGQvYXNzZXRzLmpzb25cbi8vIG1vZHVsZSBpZCA9IC4vYnVpbGQvYXNzZXRzLmpzb25cbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\nmodule.exports = function(useSourceMap) {\n\tvar list = [];\n\n\t// return the list of modules as css string\n\tlist.toString = function toString() {\n\t\treturn this.map(function (item) {\n\t\t\tvar content = cssWithMappingToString(item, useSourceMap);\n\t\t\tif(item[2]) {\n\t\t\t\treturn \"@media \" + item[2] + \"{\" + content + \"}\";\n\t\t\t} else {\n\t\t\t\treturn content;\n\t\t\t}\n\t\t}).join(\"\");\n\t};\n\n\t// import a list of modules into the list\n\tlist.i = function(modules, mediaQuery) {\n\t\tif(typeof modules === \"string\")\n\t\t\tmodules = [[null, modules, \"\"]];\n\t\tvar alreadyImportedModules = {};\n\t\tfor(var i = 0; i < this.length; i++) {\n\t\t\tvar id = this[i][0];\n\t\t\tif(typeof id === \"number\")\n\t\t\t\talreadyImportedModules[id] = true;\n\t\t}\n\t\tfor(i = 0; i < modules.length; i++) {\n\t\t\tvar item = modules[i];\n\t\t\t// skip already imported module\n\t\t\t// this implementation is not 100% perfect for weird media query combinations\n\t\t\t//  when a module is imported multiple times with different media queries.\n\t\t\t//  I hope this will never occur (Hey this way we have smaller bundles)\n\t\t\tif(typeof item[0] !== \"number\" || !alreadyImportedModules[item[0]]) {\n\t\t\t\tif(mediaQuery && !item[2]) {\n\t\t\t\t\titem[2] = mediaQuery;\n\t\t\t\t} else if(mediaQuery) {\n\t\t\t\t\titem[2] = \"(\" + item[2] + \") and (\" + mediaQuery + \")\";\n\t\t\t\t}\n\t\t\t\tlist.push(item);\n\t\t\t}\n\t\t}\n\t};\n\treturn list;\n};\n\nfunction cssWithMappingToString(item, useSourceMap) {\n\tvar content = item[1] || '';\n\tvar cssMapping = item[3];\n\tif (!cssMapping) {\n\t\treturn content;\n\t}\n\n\tif (useSourceMap && typeof btoa === 'function') {\n\t\tvar sourceMapping = toComment(cssMapping);\n\t\tvar sourceURLs = cssMapping.sources.map(function (source) {\n\t\t\treturn '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'\n\t\t});\n\n\t\treturn [content].concat(sourceURLs).concat([sourceMapping]).join('\\n');\n\t}\n\n\treturn [content].join('\\n');\n}\n\n// Adapted from convert-source-map (MIT)\nfunction toComment(sourceMap) {\n\t// eslint-disable-next-line no-undef\n\tvar base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));\n\tvar data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;\n\n\treturn '/*# ' + data + ' */';\n}\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQiXSwic291cmNlc0NvbnRlbnQiOlsiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/***/ (function(module, exports) {

eval("/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\nmodule.exports = function(updatedModules, renewedModules) {\r\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\r\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\r\n\t});\r\n\r\n\tif(unacceptedModules.length > 0) {\r\n\t\tconsole.warn(\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\");\r\n\t\tunacceptedModules.forEach(function(moduleId) {\r\n\t\t\tconsole.warn(\"[HMR]  - \" + moduleId);\r\n\t\t});\r\n\t}\r\n\r\n\tif(!renewedModules || renewedModules.length === 0) {\r\n\t\tconsole.log(\"[HMR] Nothing hot updated.\");\r\n\t} else {\r\n\t\tconsole.log(\"[HMR] Updated modules:\");\r\n\t\trenewedModules.forEach(function(moduleId) {\r\n\t\t\tconsole.log(\"[HMR]  - \" + moduleId);\r\n\t\t});\r\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\r\n\t\t\treturn typeof moduleId === \"number\";\r\n\t\t});\r\n\t\tif(numberIds)\r\n\t\t\tconsole.log(\"[HMR] Consider using the NamedModulesPlugin for module names.\");\r\n\t}\r\n};\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8od2VicGFjaykvaG90L2xvZy1hcHBseS1yZXN1bHQuanM/ZDc2MiJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzLCByZW5ld2VkTW9kdWxlcykge1xyXG5cdHZhciB1bmFjY2VwdGVkTW9kdWxlcyA9IHVwZGF0ZWRNb2R1bGVzLmZpbHRlcihmdW5jdGlvbihtb2R1bGVJZCkge1xyXG5cdFx0cmV0dXJuIHJlbmV3ZWRNb2R1bGVzICYmIHJlbmV3ZWRNb2R1bGVzLmluZGV4T2YobW9kdWxlSWQpIDwgMDtcclxuXHR9KTtcclxuXHJcblx0aWYodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gVGhlIGZvbGxvd2luZyBtb2R1bGVzIGNvdWxkbid0IGJlIGhvdCB1cGRhdGVkOiAoVGhleSB3b3VsZCBuZWVkIGEgZnVsbCByZWxvYWQhKVwiKTtcclxuXHRcdHVuYWNjZXB0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmKCFyZW5ld2VkTW9kdWxlcyB8fCByZW5ld2VkTW9kdWxlcy5sZW5ndGggPT09IDApIHtcclxuXHRcdGNvbnNvbGUubG9nKFwiW0hNUl0gTm90aGluZyBob3QgdXBkYXRlZC5cIik7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbnNvbGUubG9nKFwiW0hNUl0gVXBkYXRlZCBtb2R1bGVzOlwiKTtcclxuXHRcdHJlbmV3ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcclxuXHRcdH0pO1xyXG5cdFx0dmFyIG51bWJlcklkcyA9IHJlbmV3ZWRNb2R1bGVzLmV2ZXJ5KGZ1bmN0aW9uKG1vZHVsZUlkKSB7XHJcblx0XHRcdHJldHVybiB0eXBlb2YgbW9kdWxlSWQgPT09IFwibnVtYmVyXCI7XHJcblx0XHR9KTtcclxuXHRcdGlmKG51bWJlcklkcylcclxuXHRcdFx0Y29uc29sZS5sb2coXCJbSE1SXSBDb25zaWRlciB1c2luZyB0aGUgTmFtZWRNb2R1bGVzUGx1Z2luIGZvciBtb2R1bGUgbmFtZXMuXCIpO1xyXG5cdH1cclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2hvdC9sb2ctYXBwbHktcmVzdWx0LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9sb2ctYXBwbHktcmVzdWx0LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?300":
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\n/*globals __resourceQuery */\r\nif(true) {\r\n\tvar hotPollInterval = +(__resourceQuery.substr(1)) || (10 * 60 * 1000);\r\n\r\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\r\n\t\tif(module.hot.status() === \"idle\") {\r\n\t\t\tmodule.hot.check(true).then(function(updatedModules) {\r\n\t\t\t\tif(!updatedModules) {\r\n\t\t\t\t\tif(fromUpdate) console.log(\"[HMR] Update applied.\");\r\n\t\t\t\t\treturn;\r\n\t\t\t\t}\r\n\t\t\t\t__webpack_require__(\"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\r\n\t\t\t\tcheckForUpdate(true);\r\n\t\t\t}).catch(function(err) {\r\n\t\t\t\tvar status = module.hot.status();\r\n\t\t\t\tif([\"abort\", \"fail\"].indexOf(status) >= 0) {\r\n\t\t\t\t\tconsole.warn(\"[HMR] Cannot apply update.\");\r\n\t\t\t\t\tconsole.warn(\"[HMR] \" + err.stack || err.message);\r\n\t\t\t\t\tconsole.warn(\"[HMR] You need to restart the application!\");\r\n\t\t\t\t} else {\r\n\t\t\t\t\tconsole.warn(\"[HMR] Update failed: \" + err.stack || err.message);\r\n\t\t\t\t}\r\n\t\t\t});\r\n\t\t}\r\n\t};\r\n\tsetInterval(checkForUpdate, hotPollInterval);\r\n} else {\r\n\tthrow new Error(\"[HMR] Hot Module Replacement is disabled.\");\r\n}\r\n\n/* WEBPACK VAR INJECTION */}.call(exports, \"?300\"))//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvcG9sbC5qcz8zMDAuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9wb2xsLmpzP2IzZmUiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLypnbG9iYWxzIF9fcmVzb3VyY2VRdWVyeSAqL1xyXG5pZihtb2R1bGUuaG90KSB7XHJcblx0dmFyIGhvdFBvbGxJbnRlcnZhbCA9ICsoX19yZXNvdXJjZVF1ZXJ5LnN1YnN0cigxKSkgfHwgKDEwICogNjAgKiAxMDAwKTtcclxuXHJcblx0dmFyIGNoZWNrRm9yVXBkYXRlID0gZnVuY3Rpb24gY2hlY2tGb3JVcGRhdGUoZnJvbVVwZGF0ZSkge1xyXG5cdFx0aWYobW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gXCJpZGxlXCIpIHtcclxuXHRcdFx0bW9kdWxlLmhvdC5jaGVjayh0cnVlKS50aGVuKGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzKSB7XHJcblx0XHRcdFx0aWYoIXVwZGF0ZWRNb2R1bGVzKSB7XHJcblx0XHRcdFx0XHRpZihmcm9tVXBkYXRlKSBjb25zb2xlLmxvZyhcIltITVJdIFVwZGF0ZSBhcHBsaWVkLlwiKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVxdWlyZShcIi4vbG9nLWFwcGx5LXJlc3VsdFwiKSh1cGRhdGVkTW9kdWxlcywgdXBkYXRlZE1vZHVsZXMpO1xyXG5cdFx0XHRcdGNoZWNrRm9yVXBkYXRlKHRydWUpO1xyXG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuXHRcdFx0XHR2YXIgc3RhdHVzID0gbW9kdWxlLmhvdC5zdGF0dXMoKTtcclxuXHRcdFx0XHRpZihbXCJhYm9ydFwiLCBcImZhaWxcIl0uaW5kZXhPZihzdGF0dXMpID49IDApIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIENhbm5vdCBhcHBseSB1cGRhdGUuXCIpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gXCIgKyBlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gWW91IG5lZWQgdG8gcmVzdGFydCB0aGUgYXBwbGljYXRpb24hXCIpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSBVcGRhdGUgZmFpbGVkOiBcIiArIGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9O1xyXG5cdHNldEludGVydmFsKGNoZWNrRm9yVXBkYXRlLCBob3RQb2xsSW50ZXJ2YWwpO1xyXG59IGVsc2Uge1xyXG5cdHRocm93IG5ldyBFcnJvcihcIltITVJdIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgaXMgZGlzYWJsZWQuXCIpO1xyXG59XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9ob3QvcG9sbC5qcz8zMDBcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L3BvbGwuanM/MzAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ "./src/common/actions/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SET_COUNTER\", function() { return SET_COUNTER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"INCREMENT_COUNTER\", function() { return INCREMENT_COUNTER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DECREMENT_COUNTER\", function() { return DECREMENT_COUNTER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setCounter\", function() { return setCounter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"increment\", function() { return increment; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"decrement\", function() { return decrement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"asyncIncrement\", function() { return asyncIncrement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"asyncDecrement\", function() { return asyncDecrement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"asyncIncrementIfOdd\", function() { return asyncIncrementIfOdd; });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_fetchPutCounter__ = __webpack_require__(\"./src/common/modules/fetchPutCounter.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_setCounterLocalStorage__ = __webpack_require__(\"./src/common/modules/setCounterLocalStorage.js\");\n\n\nvar SET_COUNTER = 'SET_COUNTER';\nvar INCREMENT_COUNTER = 'INCREMENT_COUNTER';\nvar DECREMENT_COUNTER = 'DECREMENT_COUNTER';\n\nvar setCounter = function setCounter(count) {\n  return {\n    type: SET_COUNTER,\n    payload: parseInt(count, 10)\n  };\n};\n\nvar increment = function increment() {\n  return {\n    type: INCREMENT_COUNTER\n  };\n};\n\nvar decrement = function decrement() {\n  return {\n    type: DECREMENT_COUNTER\n  };\n};\n\nvar asyncIncrement = function asyncIncrement() {\n  return function (dispatch, getState) {\n    dispatch(increment());\n    var value = getState().counter;\n    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__modules_setCounterLocalStorage__[\"a\" /* default */])(value);\n    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__modules_fetchPutCounter__[\"a\" /* default */])(value);\n  };\n};\n\nvar asyncDecrement = function asyncDecrement() {\n  return function (dispatch, getState) {\n    dispatch(decrement());\n    var value = getState().counter;\n    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__modules_setCounterLocalStorage__[\"a\" /* default */])(value);\n    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__modules_fetchPutCounter__[\"a\" /* default */])(value);\n  };\n};\n\nvar asyncIncrementIfOdd = function asyncIncrementIfOdd() {\n  return function (dispatch, getState) {\n    var _getState = getState(),\n        counter = _getState.counter;\n\n    if (counter % 2 === 0) {\n      return;\n    }\n    dispatch(increment());\n    var value = getState().counter;\n    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__modules_setCounterLocalStorage__[\"a\" /* default */])(value);\n    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__modules_fetchPutCounter__[\"a\" /* default */])(value);\n  };\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL2FjdGlvbnMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2FjdGlvbnMvaW5kZXguanM/YzQ4NCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmV0Y2hQdXRDb3VudGVyIGZyb20gJy4uL21vZHVsZXMvZmV0Y2hQdXRDb3VudGVyJztcbmltcG9ydCBzZXRDb3VudGVyTG9jYWxTdG9yYWdlIGZyb20gJy4uL21vZHVsZXMvc2V0Q291bnRlckxvY2FsU3RvcmFnZSc7XG5leHBvcnQgdmFyIFNFVF9DT1VOVEVSID0gJ1NFVF9DT1VOVEVSJztcbmV4cG9ydCB2YXIgSU5DUkVNRU5UX0NPVU5URVIgPSAnSU5DUkVNRU5UX0NPVU5URVInO1xuZXhwb3J0IHZhciBERUNSRU1FTlRfQ09VTlRFUiA9ICdERUNSRU1FTlRfQ09VTlRFUic7XG5cbmV4cG9ydCB2YXIgc2V0Q291bnRlciA9IGZ1bmN0aW9uIHNldENvdW50ZXIoY291bnQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBTRVRfQ09VTlRFUixcbiAgICBwYXlsb2FkOiBwYXJzZUludChjb3VudCwgMTApXG4gIH07XG59O1xuXG5leHBvcnQgdmFyIGluY3JlbWVudCA9IGZ1bmN0aW9uIGluY3JlbWVudCgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBJTkNSRU1FTlRfQ09VTlRFUlxuICB9O1xufTtcblxuZXhwb3J0IHZhciBkZWNyZW1lbnQgPSBmdW5jdGlvbiBkZWNyZW1lbnQoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogREVDUkVNRU5UX0NPVU5URVJcbiAgfTtcbn07XG5cbmV4cG9ydCB2YXIgYXN5bmNJbmNyZW1lbnQgPSBmdW5jdGlvbiBhc3luY0luY3JlbWVudCgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcbiAgICBkaXNwYXRjaChpbmNyZW1lbnQoKSk7XG4gICAgdmFyIHZhbHVlID0gZ2V0U3RhdGUoKS5jb3VudGVyO1xuICAgIHNldENvdW50ZXJMb2NhbFN0b3JhZ2UodmFsdWUpO1xuICAgIHJldHVybiBmZXRjaFB1dENvdW50ZXIodmFsdWUpO1xuICB9O1xufTtcblxuZXhwb3J0IHZhciBhc3luY0RlY3JlbWVudCA9IGZ1bmN0aW9uIGFzeW5jRGVjcmVtZW50KCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xuICAgIGRpc3BhdGNoKGRlY3JlbWVudCgpKTtcbiAgICB2YXIgdmFsdWUgPSBnZXRTdGF0ZSgpLmNvdW50ZXI7XG4gICAgc2V0Q291bnRlckxvY2FsU3RvcmFnZSh2YWx1ZSk7XG4gICAgcmV0dXJuIGZldGNoUHV0Q291bnRlcih2YWx1ZSk7XG4gIH07XG59O1xuXG5leHBvcnQgdmFyIGFzeW5jSW5jcmVtZW50SWZPZGQgPSBmdW5jdGlvbiBhc3luY0luY3JlbWVudElmT2RkKCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xuICAgIHZhciBfZ2V0U3RhdGUgPSBnZXRTdGF0ZSgpLFxuICAgICAgICBjb3VudGVyID0gX2dldFN0YXRlLmNvdW50ZXI7XG5cbiAgICBpZiAoY291bnRlciAlIDIgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGlzcGF0Y2goaW5jcmVtZW50KCkpO1xuICAgIHZhciB2YWx1ZSA9IGdldFN0YXRlKCkuY291bnRlcjtcbiAgICBzZXRDb3VudGVyTG9jYWxTdG9yYWdlKHZhbHVlKTtcbiAgICByZXR1cm4gZmV0Y2hQdXRDb3VudGVyKHZhbHVlKTtcbiAgfTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tbW9uL2FjdGlvbnMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2NvbW1vbi9hY3Rpb25zL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ "./src/common/api/counter.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return fetchCounter; });\nvar url = 'https://59257e8a21cf650011fddc9b.mockapi.io/counter/count/count';\n\nvar fetchCounter = function fetchCounter(callback) {\n  return fetch(url).then(function (res) {\n    return res.json();\n  }).then(function (count) {\n    // return count[0].count;\n    callback(count[0].count);\n  }).catch(function (err) {\n    console.log('error in fetchCounter: ', err);\n  });\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL2FwaS9jb3VudGVyLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9hcGkvY291bnRlci5qcz8xZjYwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciB1cmwgPSAnaHR0cHM6Ly81OTI1N2U4YTIxY2Y2NTAwMTFmZGRjOWIubW9ja2FwaS5pby9jb3VudGVyL2NvdW50L2NvdW50JztcblxuZXhwb3J0IHZhciBmZXRjaENvdW50ZXIgPSBmdW5jdGlvbiBmZXRjaENvdW50ZXIoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZldGNoKHVybCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gIH0pLnRoZW4oZnVuY3Rpb24gKGNvdW50KSB7XG4gICAgLy8gcmV0dXJuIGNvdW50WzBdLmNvdW50O1xuICAgIGNhbGxiYWNrKGNvdW50WzBdLmNvdW50KTtcbiAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgIGNvbnNvbGUubG9nKCdlcnJvciBpbiBmZXRjaENvdW50ZXI6ICcsIGVycik7XG4gIH0pO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21tb24vYXBpL2NvdW50ZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2NvbW1vbi9hcGkvY291bnRlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ "./src/common/components/counter/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__(1);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(3);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(5);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_redux__ = __webpack_require__(9);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_redux__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_redux__ = __webpack_require__(7);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_redux__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__actions__ = __webpack_require__(\"./src/common/actions/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__modules_getCounterLocalStorage__ = __webpack_require__(\"./src/common/modules/getCounterLocalStorage.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__modules_fetchCount__ = __webpack_require__(\"./src/common/modules/fetchCount.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__style_css__ = __webpack_require__(\"./src/common/components/counter/style.css\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__style_css__);\n\n\n\n\n\nvar _jsxFileName = 'C:\\\\Users\\\\thekho.ngaosathe\\\\Desktop\\\\razzle-react-redux-starter\\\\src\\\\common\\\\components\\\\counter\\\\index.js';\n\n\n\n\n\n\n\n\nvar Counter = function (_Component) {\n  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Counter, _Component);\n\n  function Counter() {\n    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Counter);\n\n    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Counter.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Counter)).apply(this, arguments));\n  }\n\n  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Counter, [{\n    key: 'componentDidMount',\n    value: function componentDidMount() {\n      var setCounter = this.props.setCounter;\n\n      var localStorageCounter = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__modules_getCounterLocalStorage__[\"a\" /* default */])();\n      console.log('getCounterLocalStorage: ', localStorageCounter);\n      if (!localStorageCounter) {\n        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__modules_fetchCount__[\"a\" /* default */])(setCounter);\n      } else {\n        setCounter(localStorageCounter);\n        console.log('using locally stored counter. . .');\n      }\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var _props = this.props,\n          asyncIncrement = _props.asyncIncrement,\n          asyncDecrement = _props.asyncDecrement,\n          asyncIncrementIfOdd = _props.asyncIncrementIfOdd,\n          counter = _props.counter;\n\n      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(\n        'p',\n        {\n          __source: {\n            fileName: _jsxFileName,\n            lineNumber: 24\n          }\n        },\n        'Clicked: ',\n        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(\n          'b',\n          {\n            __source: {\n              fileName: _jsxFileName,\n              lineNumber: 25\n            }\n          },\n          counter\n        ),\n        ' times',\n        ' ',\n        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(\n          'button',\n          { onClick: asyncIncrement, __source: {\n              fileName: _jsxFileName,\n              lineNumber: 27\n            }\n          },\n          '+'\n        ),\n        ' ',\n        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(\n          'button',\n          { onClick: asyncDecrement, __source: {\n              fileName: _jsxFileName,\n              lineNumber: 29\n            }\n          },\n          '-'\n        ),\n        ' ',\n        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(\n          'button',\n          { onClick: asyncIncrementIfOdd, __source: {\n              fileName: _jsxFileName,\n              lineNumber: 31\n            }\n          },\n          'Increment if odd'\n        )\n      );\n    }\n  }]);\n\n  return Counter;\n}(__WEBPACK_IMPORTED_MODULE_5_react__[\"Component\"]);\n\nvar mapStateToProps = function mapStateToProps(state) {\n  return {\n    counter: state.counter\n  };\n};\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7_redux__[\"bindActionCreators\"])(__WEBPACK_IMPORTED_MODULE_8__actions__, dispatch);\n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6_react_redux__[\"connect\"])(mapStateToProps, mapDispatchToProps)(Counter));//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvY291bnRlci9pbmRleC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21tb24vY29tcG9uZW50cy9jb3VudGVyL2luZGV4LmpzP2U4YWMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9PYmplY3QkZ2V0UHJvdG90eXBlT2YgZnJvbSAnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mJztcbmltcG9ydCBfY2xhc3NDYWxsQ2hlY2sgZnJvbSAnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJztcbmltcG9ydCBfY3JlYXRlQ2xhc3MgZnJvbSAnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzJztcbmltcG9ydCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiBmcm9tICdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybic7XG5pbXBvcnQgX2luaGVyaXRzIGZyb20gJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cyc7XG52YXIgX2pzeEZpbGVOYW1lID0gJ0M6XFxcXFVzZXJzXFxcXHRoZWtoby5uZ2Fvc2F0aGVcXFxcRGVza3RvcFxcXFxyYXp6bGUtcmVhY3QtcmVkdXgtc3RhcnRlclxcXFxzcmNcXFxcY29tbW9uXFxcXGNvbXBvbmVudHNcXFxcY291bnRlclxcXFxpbmRleC5qcyc7XG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi4vLi4vYWN0aW9ucyc7XG5pbXBvcnQgZ2V0Q291bnRlckxvY2FsU3RvcmFnZSBmcm9tICcuLi8uLi9tb2R1bGVzL2dldENvdW50ZXJMb2NhbFN0b3JhZ2UnO1xuaW1wb3J0IGZldGNoQ291bnQgZnJvbSAnLi4vLi4vbW9kdWxlcy9mZXRjaENvdW50JztcbmltcG9ydCAnLi9zdHlsZS5jc3MnO1xuXG52YXIgQ291bnRlciA9IGZ1bmN0aW9uIChfQ29tcG9uZW50KSB7XG4gIF9pbmhlcml0cyhDb3VudGVyLCBfQ29tcG9uZW50KTtcblxuICBmdW5jdGlvbiBDb3VudGVyKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb3VudGVyKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoQ291bnRlci5fX3Byb3RvX18gfHwgX09iamVjdCRnZXRQcm90b3R5cGVPZihDb3VudGVyKSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ291bnRlciwgW3tcbiAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgdmFyIHNldENvdW50ZXIgPSB0aGlzLnByb3BzLnNldENvdW50ZXI7XG5cbiAgICAgIHZhciBsb2NhbFN0b3JhZ2VDb3VudGVyID0gZ2V0Q291bnRlckxvY2FsU3RvcmFnZSgpO1xuICAgICAgY29uc29sZS5sb2coJ2dldENvdW50ZXJMb2NhbFN0b3JhZ2U6ICcsIGxvY2FsU3RvcmFnZUNvdW50ZXIpO1xuICAgICAgaWYgKCFsb2NhbFN0b3JhZ2VDb3VudGVyKSB7XG4gICAgICAgIGZldGNoQ291bnQoc2V0Q291bnRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRDb3VudGVyKGxvY2FsU3RvcmFnZUNvdW50ZXIpO1xuICAgICAgICBjb25zb2xlLmxvZygndXNpbmcgbG9jYWxseSBzdG9yZWQgY291bnRlci4gLiAuJyk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVuZGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgYXN5bmNJbmNyZW1lbnQgPSBfcHJvcHMuYXN5bmNJbmNyZW1lbnQsXG4gICAgICAgICAgYXN5bmNEZWNyZW1lbnQgPSBfcHJvcHMuYXN5bmNEZWNyZW1lbnQsXG4gICAgICAgICAgYXN5bmNJbmNyZW1lbnRJZk9kZCA9IF9wcm9wcy5hc3luY0luY3JlbWVudElmT2RkLFxuICAgICAgICAgIGNvdW50ZXIgPSBfcHJvcHMuY291bnRlcjtcblxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdwJyxcbiAgICAgICAge1xuICAgICAgICAgIF9fc291cmNlOiB7XG4gICAgICAgICAgICBmaWxlTmFtZTogX2pzeEZpbGVOYW1lLFxuICAgICAgICAgICAgbGluZU51bWJlcjogMjRcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdDbGlja2VkOiAnLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdiJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBfX3NvdXJjZToge1xuICAgICAgICAgICAgICBmaWxlTmFtZTogX2pzeEZpbGVOYW1lLFxuICAgICAgICAgICAgICBsaW5lTnVtYmVyOiAyNVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY291bnRlclxuICAgICAgICApLFxuICAgICAgICAnIHRpbWVzJyxcbiAgICAgICAgJyAnLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgIHsgb25DbGljazogYXN5bmNJbmNyZW1lbnQsIF9fc291cmNlOiB7XG4gICAgICAgICAgICAgIGZpbGVOYW1lOiBfanN4RmlsZU5hbWUsXG4gICAgICAgICAgICAgIGxpbmVOdW1iZXI6IDI3XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAnKydcbiAgICAgICAgKSxcbiAgICAgICAgJyAnLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgIHsgb25DbGljazogYXN5bmNEZWNyZW1lbnQsIF9fc291cmNlOiB7XG4gICAgICAgICAgICAgIGZpbGVOYW1lOiBfanN4RmlsZU5hbWUsXG4gICAgICAgICAgICAgIGxpbmVOdW1iZXI6IDI5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAnLSdcbiAgICAgICAgKSxcbiAgICAgICAgJyAnLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgIHsgb25DbGljazogYXN5bmNJbmNyZW1lbnRJZk9kZCwgX19zb3VyY2U6IHtcbiAgICAgICAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgICAgICAgbGluZU51bWJlcjogMzFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgICdJbmNyZW1lbnQgaWYgb2RkJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDb3VudGVyO1xufShDb21wb25lbnQpO1xuXG52YXIgbWFwU3RhdGVUb1Byb3BzID0gZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG4gIHJldHVybiB7XG4gICAgY291bnRlcjogc3RhdGUuY291bnRlclxuICB9O1xufTtcbnZhciBtYXBEaXNwYXRjaFRvUHJvcHMgPSBmdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcbiAgcmV0dXJuIGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25zLCBkaXNwYXRjaCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShDb3VudGVyKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21tb24vY29tcG9uZW50cy9jb3VudGVyL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9jb21tb24vY29tcG9uZW50cy9jb3VudGVyL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),

/***/ "./src/common/components/counter/style.css":
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(\"./node_modules/css-loader/lib/css-base.js\")(undefined);\n// imports\n\n\n// module\nexports.push([module.i, \"*{margin:0;padding:0;} *,*:after,*:before{box-sizing:inherit}html{box-sizing:border-box;font-size:62.5%}body{color:#606c76;font-family:'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;font-size:1.6em;font-weight:300;letter-spacing:.01em;line-height:1.6}blockquote{border-left:0.3rem solid #d1d1d1;margin-left:0;margin-right:0;padding:1rem 1.5rem}blockquote *:last-child{margin-bottom:0}.button,button,input[type='button'],input[type='reset'],input[type='submit']{background-color:#9b4dca;border:0.1rem solid #9b4dca;border-radius:.4rem;color:#fff;cursor:pointer;display:inline-block;font-size:1.1rem;font-weight:700;height:3.8rem;letter-spacing:.1rem;line-height:3.8rem;padding:0 3.0rem;text-align:center;text-decoration:none;text-transform:uppercase;white-space:nowrap}.button:focus,.button:hover,button:focus,button:hover,input[type='button']:focus,input[type='button']:hover,input[type='reset']:focus,input[type='reset']:hover,input[type='submit']:focus,input[type='submit']:hover{background-color:#606c76;border-color:#606c76;color:#fff;outline:0}.button[disabled],button[disabled],input[type='button'][disabled],input[type='reset'][disabled],input[type='submit'][disabled]{cursor:default;opacity:.5}.button[disabled]:focus,.button[disabled]:hover,button[disabled]:focus,button[disabled]:hover,input[type='button'][disabled]:focus,input[type='button'][disabled]:hover,input[type='reset'][disabled]:focus,input[type='reset'][disabled]:hover,input[type='submit'][disabled]:focus,input[type='submit'][disabled]:hover{background-color:#9b4dca;border-color:#9b4dca}.button.button-outline,button.button-outline,input[type='button'].button-outline,input[type='reset'].button-outline,input[type='submit'].button-outline{background-color:transparent;color:#9b4dca}.button.button-outline:focus,.button.button-outline:hover,button.button-outline:focus,button.button-outline:hover,input[type='button'].button-outline:focus,input[type='button'].button-outline:hover,input[type='reset'].button-outline:focus,input[type='reset'].button-outline:hover,input[type='submit'].button-outline:focus,input[type='submit'].button-outline:hover{background-color:transparent;border-color:#606c76;color:#606c76}.button.button-outline[disabled]:focus,.button.button-outline[disabled]:hover,button.button-outline[disabled]:focus,button.button-outline[disabled]:hover,input[type='button'].button-outline[disabled]:focus,input[type='button'].button-outline[disabled]:hover,input[type='reset'].button-outline[disabled]:focus,input[type='reset'].button-outline[disabled]:hover,input[type='submit'].button-outline[disabled]:focus,input[type='submit'].button-outline[disabled]:hover{border-color:inherit;color:#9b4dca}.button.button-clear,button.button-clear,input[type='button'].button-clear,input[type='reset'].button-clear,input[type='submit'].button-clear{background-color:transparent;border-color:transparent;color:#9b4dca}.button.button-clear:focus,.button.button-clear:hover,button.button-clear:focus,button.button-clear:hover,input[type='button'].button-clear:focus,input[type='button'].button-clear:hover,input[type='reset'].button-clear:focus,input[type='reset'].button-clear:hover,input[type='submit'].button-clear:focus,input[type='submit'].button-clear:hover{background-color:transparent;border-color:transparent;color:#606c76}.button.button-clear[disabled]:focus,.button.button-clear[disabled]:hover,button.button-clear[disabled]:focus,button.button-clear[disabled]:hover,input[type='button'].button-clear[disabled]:focus,input[type='button'].button-clear[disabled]:hover,input[type='reset'].button-clear[disabled]:focus,input[type='reset'].button-clear[disabled]:hover,input[type='submit'].button-clear[disabled]:focus,input[type='submit'].button-clear[disabled]:hover{color:#9b4dca}code{background:#f4f5f6;border-radius:.4rem;font-size:86%;margin:0 .2rem;padding:.2rem .5rem;white-space:nowrap}pre{background:#f4f5f6;border-left:0.3rem solid #9b4dca;overflow-y:hidden}pre>code{border-radius:0;display:block;padding:1rem 1.5rem;white-space:pre}hr{border:0;border-top:0.1rem solid #f4f5f6;margin:3.0rem 0}input[type='email'],input[type='number'],input[type='password'],input[type='search'],input[type='tel'],input[type='text'],input[type='url'],textarea,select{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border:0.1rem solid #d1d1d1;border-radius:.4rem;box-shadow:none;box-sizing:inherit;height:3.8rem;padding:.6rem 1.0rem;width:100%}input[type='email']:focus,input[type='number']:focus,input[type='password']:focus,input[type='search']:focus,input[type='tel']:focus,input[type='text']:focus,input[type='url']:focus,textarea:focus,select:focus{border-color:#9b4dca;outline:0}select{background:url('data:image/svg+xml;utf8,<svg xmlns=\\\"http://www.w3.org/2000/svg\\\" height=\\\"14\\\" viewBox=\\\"0 0 29 14\\\" width=\\\"29\\\"><path fill=\\\"#d1d1d1\\\" d=\\\"M9.37727 3.625l5.08154 6.93523L19.54036 3.625\\\"/></svg>') center right no-repeat;padding-right:3.0rem}select:focus{background-image:url('data:image/svg+xml;utf8,<svg xmlns=\\\"http://www.w3.org/2000/svg\\\" height=\\\"14\\\" viewBox=\\\"0 0 29 14\\\" width=\\\"29\\\"><path fill=\\\"#9b4dca\\\" d=\\\"M9.37727 3.625l5.08154 6.93523L19.54036 3.625\\\"/></svg>')}textarea{min-height:6.5rem}label,legend{display:block;font-size:1.6rem;font-weight:700;margin-bottom:.5rem}fieldset{border-width:0;padding:0}input[type='checkbox'],input[type='radio']{display:inline}.label-inline{display:inline-block;font-weight:normal;margin-left:.5rem}.container{margin:0 auto;max-width:112.0rem;padding:0 2.0rem;position:relative;width:100%}.row{display:flex;flex-direction:column;padding:0;width:100%}.row.row-no-padding{padding:0}.row.row-no-padding>.column{padding:0}.row.row-wrap{flex-wrap:wrap}.row.row-top{align-items:flex-start}.row.row-bottom{align-items:flex-end}.row.row-center{align-items:center}.row.row-stretch{align-items:stretch}.row.row-baseline{align-items:baseline}.row .column{display:block;flex:1 1 auto;margin-left:0;max-width:100%;width:100%}.row .column.column-offset-10{margin-left:10%}.row .column.column-offset-20{margin-left:20%}.row .column.column-offset-25{margin-left:25%}.row .column.column-offset-33,.row .column.column-offset-34{margin-left:33.3333%}.row .column.column-offset-50{margin-left:50%}.row .column.column-offset-66,.row .column.column-offset-67{margin-left:66.6666%}.row .column.column-offset-75{margin-left:75%}.row .column.column-offset-80{margin-left:80%}.row .column.column-offset-90{margin-left:90%}.row .column.column-10{flex:0 0 10%;max-width:10%}.row .column.column-20{flex:0 0 20%;max-width:20%}.row .column.column-25{flex:0 0 25%;max-width:25%}.row .column.column-33,.row .column.column-34{flex:0 0 33.3333%;max-width:33.3333%}.row .column.column-40{flex:0 0 40%;max-width:40%}.row .column.column-50{flex:0 0 50%;max-width:50%}.row .column.column-60{flex:0 0 60%;max-width:60%}.row .column.column-66,.row .column.column-67{flex:0 0 66.6666%;max-width:66.6666%}.row .column.column-75{flex:0 0 75%;max-width:75%}.row .column.column-80{flex:0 0 80%;max-width:80%}.row .column.column-90{flex:0 0 90%;max-width:90%}.row .column .column-top{align-self:flex-start}.row .column .column-bottom{align-self:flex-end}.row .column .column-center{-ms-grid-row-align:center;align-self:center}@media (min-width: 40rem){.row{flex-direction:row;margin-left:-1.0rem;width:calc(100% + 2.0rem)}.row .column{margin-bottom:inherit;padding:0 1.0rem}}a{color:#9b4dca;text-decoration:none}a:focus,a:hover{color:#606c76}dl,ol,ul{list-style:none;margin-top:0;padding-left:0}dl dl,dl ol,dl ul,ol dl,ol ol,ol ul,ul dl,ul ol,ul ul{font-size:90%;margin:1.5rem 0 1.5rem 3.0rem}ol{list-style:decimal inside}ul{list-style:circle inside}.button,button,dd,dt,li{margin-bottom:1.0rem}fieldset,input,select,textarea{margin-bottom:1.5rem}blockquote,dl,figure,form,ol,p,pre,table,ul{margin-bottom:2.5rem}table{border-spacing:0;width:100%}td,th{border-bottom:0.1rem solid #e1e1e1;padding:1.2rem 1.5rem;text-align:left}td:first-child,th:first-child{padding-left:0}td:last-child,th:last-child{padding-right:0}b,strong{font-weight:bold}p{margin-top:0}h1,h2,h3,h4,h5,h6{font-weight:300;letter-spacing:-.1rem;margin-bottom:2.0rem;margin-top:0}h1{font-size:4.6rem;line-height:1.2}h2{font-size:3.6rem;line-height:1.25}h3{font-size:2.8rem;line-height:1.3}h4{font-size:2.2rem;letter-spacing:-.08rem;line-height:1.35}h5{font-size:1.8rem;letter-spacing:-.05rem;line-height:1.5}h6{font-size:1.6rem;letter-spacing:0;line-height:1.4}img{max-width:100%}.clearfix:after{clear:both;content:' ';display:table}.float-left{float:left}.float-right{float:right}\\r\\n\", \"\"]);\n\n// exports\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvY291bnRlci9zdHlsZS5jc3MuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvY291bnRlci9zdHlsZS5jc3M/ZDA4MCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIqe21hcmdpbjowO3BhZGRpbmc6MDt9ICosKjphZnRlciwqOmJlZm9yZXtib3gtc2l6aW5nOmluaGVyaXR9aHRtbHtib3gtc2l6aW5nOmJvcmRlci1ib3g7Zm9udC1zaXplOjYyLjUlfWJvZHl7Y29sb3I6IzYwNmM3Njtmb250LWZhbWlseTonUm9ib3RvJywgJ0hlbHZldGljYSBOZXVlJywgJ0hlbHZldGljYScsICdBcmlhbCcsIHNhbnMtc2VyaWY7Zm9udC1zaXplOjEuNmVtO2ZvbnQtd2VpZ2h0OjMwMDtsZXR0ZXItc3BhY2luZzouMDFlbTtsaW5lLWhlaWdodDoxLjZ9YmxvY2txdW90ZXtib3JkZXItbGVmdDowLjNyZW0gc29saWQgI2QxZDFkMTttYXJnaW4tbGVmdDowO21hcmdpbi1yaWdodDowO3BhZGRpbmc6MXJlbSAxLjVyZW19YmxvY2txdW90ZSAqOmxhc3QtY2hpbGR7bWFyZ2luLWJvdHRvbTowfS5idXR0b24sYnV0dG9uLGlucHV0W3R5cGU9J2J1dHRvbiddLGlucHV0W3R5cGU9J3Jlc2V0J10saW5wdXRbdHlwZT0nc3VibWl0J117YmFja2dyb3VuZC1jb2xvcjojOWI0ZGNhO2JvcmRlcjowLjFyZW0gc29saWQgIzliNGRjYTtib3JkZXItcmFkaXVzOi40cmVtO2NvbG9yOiNmZmY7Y3Vyc29yOnBvaW50ZXI7ZGlzcGxheTppbmxpbmUtYmxvY2s7Zm9udC1zaXplOjEuMXJlbTtmb250LXdlaWdodDo3MDA7aGVpZ2h0OjMuOHJlbTtsZXR0ZXItc3BhY2luZzouMXJlbTtsaW5lLWhlaWdodDozLjhyZW07cGFkZGluZzowIDMuMHJlbTt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LWRlY29yYXRpb246bm9uZTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7d2hpdGUtc3BhY2U6bm93cmFwfS5idXR0b246Zm9jdXMsLmJ1dHRvbjpob3ZlcixidXR0b246Zm9jdXMsYnV0dG9uOmhvdmVyLGlucHV0W3R5cGU9J2J1dHRvbiddOmZvY3VzLGlucHV0W3R5cGU9J2J1dHRvbiddOmhvdmVyLGlucHV0W3R5cGU9J3Jlc2V0J106Zm9jdXMsaW5wdXRbdHlwZT0ncmVzZXQnXTpob3ZlcixpbnB1dFt0eXBlPSdzdWJtaXQnXTpmb2N1cyxpbnB1dFt0eXBlPSdzdWJtaXQnXTpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiM2MDZjNzY7Ym9yZGVyLWNvbG9yOiM2MDZjNzY7Y29sb3I6I2ZmZjtvdXRsaW5lOjB9LmJ1dHRvbltkaXNhYmxlZF0sYnV0dG9uW2Rpc2FibGVkXSxpbnB1dFt0eXBlPSdidXR0b24nXVtkaXNhYmxlZF0saW5wdXRbdHlwZT0ncmVzZXQnXVtkaXNhYmxlZF0saW5wdXRbdHlwZT0nc3VibWl0J11bZGlzYWJsZWRde2N1cnNvcjpkZWZhdWx0O29wYWNpdHk6LjV9LmJ1dHRvbltkaXNhYmxlZF06Zm9jdXMsLmJ1dHRvbltkaXNhYmxlZF06aG92ZXIsYnV0dG9uW2Rpc2FibGVkXTpmb2N1cyxidXR0b25bZGlzYWJsZWRdOmhvdmVyLGlucHV0W3R5cGU9J2J1dHRvbiddW2Rpc2FibGVkXTpmb2N1cyxpbnB1dFt0eXBlPSdidXR0b24nXVtkaXNhYmxlZF06aG92ZXIsaW5wdXRbdHlwZT0ncmVzZXQnXVtkaXNhYmxlZF06Zm9jdXMsaW5wdXRbdHlwZT0ncmVzZXQnXVtkaXNhYmxlZF06aG92ZXIsaW5wdXRbdHlwZT0nc3VibWl0J11bZGlzYWJsZWRdOmZvY3VzLGlucHV0W3R5cGU9J3N1Ym1pdCddW2Rpc2FibGVkXTpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiM5YjRkY2E7Ym9yZGVyLWNvbG9yOiM5YjRkY2F9LmJ1dHRvbi5idXR0b24tb3V0bGluZSxidXR0b24uYnV0dG9uLW91dGxpbmUsaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLW91dGxpbmUsaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tb3V0bGluZSxpbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tb3V0bGluZXtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50O2NvbG9yOiM5YjRkY2F9LmJ1dHRvbi5idXR0b24tb3V0bGluZTpmb2N1cywuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lOmhvdmVyLGJ1dHRvbi5idXR0b24tb3V0bGluZTpmb2N1cyxidXR0b24uYnV0dG9uLW91dGxpbmU6aG92ZXIsaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLW91dGxpbmU6Zm9jdXMsaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLW91dGxpbmU6aG92ZXIsaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tb3V0bGluZTpmb2N1cyxpbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1vdXRsaW5lOmhvdmVyLGlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1vdXRsaW5lOmZvY3VzLGlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1vdXRsaW5lOmhvdmVye2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7Ym9yZGVyLWNvbG9yOiM2MDZjNzY7Y29sb3I6IzYwNmM3Nn0uYnV0dG9uLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpmb2N1cywuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpob3ZlcixidXR0b24uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmZvY3VzLGJ1dHRvbi5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06aG92ZXIsaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmZvY3VzLGlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpob3ZlcixpbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpmb2N1cyxpbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpob3ZlcixpbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06Zm9jdXMsaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmhvdmVye2JvcmRlci1jb2xvcjppbmhlcml0O2NvbG9yOiM5YjRkY2F9LmJ1dHRvbi5idXR0b24tY2xlYXIsYnV0dG9uLmJ1dHRvbi1jbGVhcixpbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tY2xlYXIsaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tY2xlYXIsaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLWNsZWFye2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7Ym9yZGVyLWNvbG9yOnRyYW5zcGFyZW50O2NvbG9yOiM5YjRkY2F9LmJ1dHRvbi5idXR0b24tY2xlYXI6Zm9jdXMsLmJ1dHRvbi5idXR0b24tY2xlYXI6aG92ZXIsYnV0dG9uLmJ1dHRvbi1jbGVhcjpmb2N1cyxidXR0b24uYnV0dG9uLWNsZWFyOmhvdmVyLGlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1jbGVhcjpmb2N1cyxpbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tY2xlYXI6aG92ZXIsaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tY2xlYXI6Zm9jdXMsaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tY2xlYXI6aG92ZXIsaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLWNsZWFyOmZvY3VzLGlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1jbGVhcjpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50O2JvcmRlci1jb2xvcjp0cmFuc3BhcmVudDtjb2xvcjojNjA2Yzc2fS5idXR0b24uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cywuYnV0dG9uLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06aG92ZXIsYnV0dG9uLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06Zm9jdXMsYnV0dG9uLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06aG92ZXIsaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cyxpbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVyLGlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cyxpbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06aG92ZXIsaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cyxpbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVye2NvbG9yOiM5YjRkY2F9Y29kZXtiYWNrZ3JvdW5kOiNmNGY1ZjY7Ym9yZGVyLXJhZGl1czouNHJlbTtmb250LXNpemU6ODYlO21hcmdpbjowIC4ycmVtO3BhZGRpbmc6LjJyZW0gLjVyZW07d2hpdGUtc3BhY2U6bm93cmFwfXByZXtiYWNrZ3JvdW5kOiNmNGY1ZjY7Ym9yZGVyLWxlZnQ6MC4zcmVtIHNvbGlkICM5YjRkY2E7b3ZlcmZsb3cteTpoaWRkZW59cHJlPmNvZGV7Ym9yZGVyLXJhZGl1czowO2Rpc3BsYXk6YmxvY2s7cGFkZGluZzoxcmVtIDEuNXJlbTt3aGl0ZS1zcGFjZTpwcmV9aHJ7Ym9yZGVyOjA7Ym9yZGVyLXRvcDowLjFyZW0gc29saWQgI2Y0ZjVmNjttYXJnaW46My4wcmVtIDB9aW5wdXRbdHlwZT0nZW1haWwnXSxpbnB1dFt0eXBlPSdudW1iZXInXSxpbnB1dFt0eXBlPSdwYXNzd29yZCddLGlucHV0W3R5cGU9J3NlYXJjaCddLGlucHV0W3R5cGU9J3RlbCddLGlucHV0W3R5cGU9J3RleHQnXSxpbnB1dFt0eXBlPSd1cmwnXSx0ZXh0YXJlYSxzZWxlY3R7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmU7LW1vei1hcHBlYXJhbmNlOm5vbmU7YXBwZWFyYW5jZTpub25lO2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7Ym9yZGVyOjAuMXJlbSBzb2xpZCAjZDFkMWQxO2JvcmRlci1yYWRpdXM6LjRyZW07Ym94LXNoYWRvdzpub25lO2JveC1zaXppbmc6aW5oZXJpdDtoZWlnaHQ6My44cmVtO3BhZGRpbmc6LjZyZW0gMS4wcmVtO3dpZHRoOjEwMCV9aW5wdXRbdHlwZT0nZW1haWwnXTpmb2N1cyxpbnB1dFt0eXBlPSdudW1iZXInXTpmb2N1cyxpbnB1dFt0eXBlPSdwYXNzd29yZCddOmZvY3VzLGlucHV0W3R5cGU9J3NlYXJjaCddOmZvY3VzLGlucHV0W3R5cGU9J3RlbCddOmZvY3VzLGlucHV0W3R5cGU9J3RleHQnXTpmb2N1cyxpbnB1dFt0eXBlPSd1cmwnXTpmb2N1cyx0ZXh0YXJlYTpmb2N1cyxzZWxlY3Q6Zm9jdXN7Ym9yZGVyLWNvbG9yOiM5YjRkY2E7b3V0bGluZTowfXNlbGVjdHtiYWNrZ3JvdW5kOnVybCgnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIGhlaWdodD1cXFwiMTRcXFwiIHZpZXdCb3g9XFxcIjAgMCAyOSAxNFxcXCIgd2lkdGg9XFxcIjI5XFxcIj48cGF0aCBmaWxsPVxcXCIjZDFkMWQxXFxcIiBkPVxcXCJNOS4zNzcyNyAzLjYyNWw1LjA4MTU0IDYuOTM1MjNMMTkuNTQwMzYgMy42MjVcXFwiLz48L3N2Zz4nKSBjZW50ZXIgcmlnaHQgbm8tcmVwZWF0O3BhZGRpbmctcmlnaHQ6My4wcmVtfXNlbGVjdDpmb2N1c3tiYWNrZ3JvdW5kLWltYWdlOnVybCgnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIGhlaWdodD1cXFwiMTRcXFwiIHZpZXdCb3g9XFxcIjAgMCAyOSAxNFxcXCIgd2lkdGg9XFxcIjI5XFxcIj48cGF0aCBmaWxsPVxcXCIjOWI0ZGNhXFxcIiBkPVxcXCJNOS4zNzcyNyAzLjYyNWw1LjA4MTU0IDYuOTM1MjNMMTkuNTQwMzYgMy42MjVcXFwiLz48L3N2Zz4nKX10ZXh0YXJlYXttaW4taGVpZ2h0OjYuNXJlbX1sYWJlbCxsZWdlbmR7ZGlzcGxheTpibG9jaztmb250LXNpemU6MS42cmVtO2ZvbnQtd2VpZ2h0OjcwMDttYXJnaW4tYm90dG9tOi41cmVtfWZpZWxkc2V0e2JvcmRlci13aWR0aDowO3BhZGRpbmc6MH1pbnB1dFt0eXBlPSdjaGVja2JveCddLGlucHV0W3R5cGU9J3JhZGlvJ117ZGlzcGxheTppbmxpbmV9LmxhYmVsLWlubGluZXtkaXNwbGF5OmlubGluZS1ibG9jaztmb250LXdlaWdodDpub3JtYWw7bWFyZ2luLWxlZnQ6LjVyZW19LmNvbnRhaW5lcnttYXJnaW46MCBhdXRvO21heC13aWR0aDoxMTIuMHJlbTtwYWRkaW5nOjAgMi4wcmVtO3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjEwMCV9LnJvd3tkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO3BhZGRpbmc6MDt3aWR0aDoxMDAlfS5yb3cucm93LW5vLXBhZGRpbmd7cGFkZGluZzowfS5yb3cucm93LW5vLXBhZGRpbmc+LmNvbHVtbntwYWRkaW5nOjB9LnJvdy5yb3ctd3JhcHtmbGV4LXdyYXA6d3JhcH0ucm93LnJvdy10b3B7YWxpZ24taXRlbXM6ZmxleC1zdGFydH0ucm93LnJvdy1ib3R0b217YWxpZ24taXRlbXM6ZmxleC1lbmR9LnJvdy5yb3ctY2VudGVye2FsaWduLWl0ZW1zOmNlbnRlcn0ucm93LnJvdy1zdHJldGNoe2FsaWduLWl0ZW1zOnN0cmV0Y2h9LnJvdy5yb3ctYmFzZWxpbmV7YWxpZ24taXRlbXM6YmFzZWxpbmV9LnJvdyAuY29sdW1ue2Rpc3BsYXk6YmxvY2s7ZmxleDoxIDEgYXV0bzttYXJnaW4tbGVmdDowO21heC13aWR0aDoxMDAlO3dpZHRoOjEwMCV9LnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMTB7bWFyZ2luLWxlZnQ6MTAlfS5yb3cgLmNvbHVtbi5jb2x1bW4tb2Zmc2V0LTIwe21hcmdpbi1sZWZ0OjIwJX0ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC0yNXttYXJnaW4tbGVmdDoyNSV9LnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMzMsLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMzR7bWFyZ2luLWxlZnQ6MzMuMzMzMyV9LnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtNTB7bWFyZ2luLWxlZnQ6NTAlfS5yb3cgLmNvbHVtbi5jb2x1bW4tb2Zmc2V0LTY2LC5yb3cgLmNvbHVtbi5jb2x1bW4tb2Zmc2V0LTY3e21hcmdpbi1sZWZ0OjY2LjY2NjYlfS5yb3cgLmNvbHVtbi5jb2x1bW4tb2Zmc2V0LTc1e21hcmdpbi1sZWZ0Ojc1JX0ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC04MHttYXJnaW4tbGVmdDo4MCV9LnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtOTB7bWFyZ2luLWxlZnQ6OTAlfS5yb3cgLmNvbHVtbi5jb2x1bW4tMTB7ZmxleDowIDAgMTAlO21heC13aWR0aDoxMCV9LnJvdyAuY29sdW1uLmNvbHVtbi0yMHtmbGV4OjAgMCAyMCU7bWF4LXdpZHRoOjIwJX0ucm93IC5jb2x1bW4uY29sdW1uLTI1e2ZsZXg6MCAwIDI1JTttYXgtd2lkdGg6MjUlfS5yb3cgLmNvbHVtbi5jb2x1bW4tMzMsLnJvdyAuY29sdW1uLmNvbHVtbi0zNHtmbGV4OjAgMCAzMy4zMzMzJTttYXgtd2lkdGg6MzMuMzMzMyV9LnJvdyAuY29sdW1uLmNvbHVtbi00MHtmbGV4OjAgMCA0MCU7bWF4LXdpZHRoOjQwJX0ucm93IC5jb2x1bW4uY29sdW1uLTUwe2ZsZXg6MCAwIDUwJTttYXgtd2lkdGg6NTAlfS5yb3cgLmNvbHVtbi5jb2x1bW4tNjB7ZmxleDowIDAgNjAlO21heC13aWR0aDo2MCV9LnJvdyAuY29sdW1uLmNvbHVtbi02Niwucm93IC5jb2x1bW4uY29sdW1uLTY3e2ZsZXg6MCAwIDY2LjY2NjYlO21heC13aWR0aDo2Ni42NjY2JX0ucm93IC5jb2x1bW4uY29sdW1uLTc1e2ZsZXg6MCAwIDc1JTttYXgtd2lkdGg6NzUlfS5yb3cgLmNvbHVtbi5jb2x1bW4tODB7ZmxleDowIDAgODAlO21heC13aWR0aDo4MCV9LnJvdyAuY29sdW1uLmNvbHVtbi05MHtmbGV4OjAgMCA5MCU7bWF4LXdpZHRoOjkwJX0ucm93IC5jb2x1bW4gLmNvbHVtbi10b3B7YWxpZ24tc2VsZjpmbGV4LXN0YXJ0fS5yb3cgLmNvbHVtbiAuY29sdW1uLWJvdHRvbXthbGlnbi1zZWxmOmZsZXgtZW5kfS5yb3cgLmNvbHVtbiAuY29sdW1uLWNlbnRlcnstbXMtZ3JpZC1yb3ctYWxpZ246Y2VudGVyO2FsaWduLXNlbGY6Y2VudGVyfUBtZWRpYSAobWluLXdpZHRoOiA0MHJlbSl7LnJvd3tmbGV4LWRpcmVjdGlvbjpyb3c7bWFyZ2luLWxlZnQ6LTEuMHJlbTt3aWR0aDpjYWxjKDEwMCUgKyAyLjByZW0pfS5yb3cgLmNvbHVtbnttYXJnaW4tYm90dG9tOmluaGVyaXQ7cGFkZGluZzowIDEuMHJlbX19YXtjb2xvcjojOWI0ZGNhO3RleHQtZGVjb3JhdGlvbjpub25lfWE6Zm9jdXMsYTpob3Zlcntjb2xvcjojNjA2Yzc2fWRsLG9sLHVse2xpc3Qtc3R5bGU6bm9uZTttYXJnaW4tdG9wOjA7cGFkZGluZy1sZWZ0OjB9ZGwgZGwsZGwgb2wsZGwgdWwsb2wgZGwsb2wgb2wsb2wgdWwsdWwgZGwsdWwgb2wsdWwgdWx7Zm9udC1zaXplOjkwJTttYXJnaW46MS41cmVtIDAgMS41cmVtIDMuMHJlbX1vbHtsaXN0LXN0eWxlOmRlY2ltYWwgaW5zaWRlfXVse2xpc3Qtc3R5bGU6Y2lyY2xlIGluc2lkZX0uYnV0dG9uLGJ1dHRvbixkZCxkdCxsaXttYXJnaW4tYm90dG9tOjEuMHJlbX1maWVsZHNldCxpbnB1dCxzZWxlY3QsdGV4dGFyZWF7bWFyZ2luLWJvdHRvbToxLjVyZW19YmxvY2txdW90ZSxkbCxmaWd1cmUsZm9ybSxvbCxwLHByZSx0YWJsZSx1bHttYXJnaW4tYm90dG9tOjIuNXJlbX10YWJsZXtib3JkZXItc3BhY2luZzowO3dpZHRoOjEwMCV9dGQsdGh7Ym9yZGVyLWJvdHRvbTowLjFyZW0gc29saWQgI2UxZTFlMTtwYWRkaW5nOjEuMnJlbSAxLjVyZW07dGV4dC1hbGlnbjpsZWZ0fXRkOmZpcnN0LWNoaWxkLHRoOmZpcnN0LWNoaWxke3BhZGRpbmctbGVmdDowfXRkOmxhc3QtY2hpbGQsdGg6bGFzdC1jaGlsZHtwYWRkaW5nLXJpZ2h0OjB9YixzdHJvbmd7Zm9udC13ZWlnaHQ6Ym9sZH1we21hcmdpbi10b3A6MH1oMSxoMixoMyxoNCxoNSxoNntmb250LXdlaWdodDozMDA7bGV0dGVyLXNwYWNpbmc6LS4xcmVtO21hcmdpbi1ib3R0b206Mi4wcmVtO21hcmdpbi10b3A6MH1oMXtmb250LXNpemU6NC42cmVtO2xpbmUtaGVpZ2h0OjEuMn1oMntmb250LXNpemU6My42cmVtO2xpbmUtaGVpZ2h0OjEuMjV9aDN7Zm9udC1zaXplOjIuOHJlbTtsaW5lLWhlaWdodDoxLjN9aDR7Zm9udC1zaXplOjIuMnJlbTtsZXR0ZXItc3BhY2luZzotLjA4cmVtO2xpbmUtaGVpZ2h0OjEuMzV9aDV7Zm9udC1zaXplOjEuOHJlbTtsZXR0ZXItc3BhY2luZzotLjA1cmVtO2xpbmUtaGVpZ2h0OjEuNX1oNntmb250LXNpemU6MS42cmVtO2xldHRlci1zcGFjaW5nOjA7bGluZS1oZWlnaHQ6MS40fWltZ3ttYXgtd2lkdGg6MTAwJX0uY2xlYXJmaXg6YWZ0ZXJ7Y2xlYXI6Ym90aDtjb250ZW50OicgJztkaXNwbGF5OnRhYmxlfS5mbG9hdC1sZWZ0e2Zsb2F0OmxlZnR9LmZsb2F0LXJpZ2h0e2Zsb2F0OnJpZ2h0fVxcclxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbW1vbi9jb21wb25lbnRzL2NvdW50ZXIvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9jb21tb24vY29tcG9uZW50cy9jb3VudGVyL3N0eWxlLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ "./src/common/components/nav/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__(1);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(3);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(5);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_router_dom__ = __webpack_require__(6);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_router_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_router_dom__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__style_css__ = __webpack_require__(\"./src/common/components/nav/style.css\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__style_css__);\n\n\n\n\n\nvar _jsxFileName = 'C:\\\\Users\\\\thekho.ngaosathe\\\\Desktop\\\\razzle-react-redux-starter\\\\src\\\\common\\\\components\\\\nav\\\\index.js';\n\n\n\n\nvar Nav = function (_Component) {\n  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Nav, _Component);\n\n  function Nav() {\n    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Nav);\n\n    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Nav.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Nav)).apply(this, arguments));\n  }\n\n  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Nav, [{\n    key: 'render',\n    value: function render() {\n      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(\n        'nav',\n        {\n          __source: {\n            fileName: _jsxFileName,\n            lineNumber: 8\n          }\n        },\n        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(\n          __WEBPACK_IMPORTED_MODULE_6_react_router_dom__[\"NavLink\"],\n          { exact: true, to: '/', activeClassName: 'active', __source: {\n              fileName: _jsxFileName,\n              lineNumber: 9\n            }\n          },\n          'home'\n        ),\n        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(\n          __WEBPACK_IMPORTED_MODULE_6_react_router_dom__[\"NavLink\"],\n          { exact: true, to: '/counter', activeClassName: 'active', __source: {\n              fileName: _jsxFileName,\n              lineNumber: 10\n            }\n          },\n          'counter'\n        )\n      );\n    }\n  }]);\n\n  return Nav;\n}(__WEBPACK_IMPORTED_MODULE_5_react__[\"Component\"]);\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (Nav);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvbmF2L2luZGV4LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9jb21wb25lbnRzL25hdi9pbmRleC5qcz80ZWRlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfT2JqZWN0JGdldFByb3RvdHlwZU9mIGZyb20gJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZic7XG5pbXBvcnQgX2NsYXNzQ2FsbENoZWNrIGZyb20gJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjayc7XG5pbXBvcnQgX2NyZWF0ZUNsYXNzIGZyb20gJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcyc7XG5pbXBvcnQgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4gZnJvbSAnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nO1xuaW1wb3J0IF9pbmhlcml0cyBmcm9tICdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnO1xudmFyIF9qc3hGaWxlTmFtZSA9ICdDOlxcXFxVc2Vyc1xcXFx0aGVraG8ubmdhb3NhdGhlXFxcXERlc2t0b3BcXFxccmF6emxlLXJlYWN0LXJlZHV4LXN0YXJ0ZXJcXFxcc3JjXFxcXGNvbW1vblxcXFxjb21wb25lbnRzXFxcXG5hdlxcXFxpbmRleC5qcyc7XG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgTmF2TGluayB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5cbnZhciBOYXYgPSBmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICBfaW5oZXJpdHMoTmF2LCBfQ29tcG9uZW50KTtcblxuICBmdW5jdGlvbiBOYXYoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE5hdik7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKE5hdi5fX3Byb3RvX18gfHwgX09iamVjdCRnZXRQcm90b3R5cGVPZihOYXYpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhOYXYsIFt7XG4gICAga2V5OiAncmVuZGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICduYXYnLFxuICAgICAgICB7XG4gICAgICAgICAgX19zb3VyY2U6IHtcbiAgICAgICAgICAgIGZpbGVOYW1lOiBfanN4RmlsZU5hbWUsXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiA4XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgIE5hdkxpbmssXG4gICAgICAgICAgeyBleGFjdDogdHJ1ZSwgdG86ICcvJywgYWN0aXZlQ2xhc3NOYW1lOiAnYWN0aXZlJywgX19zb3VyY2U6IHtcbiAgICAgICAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgICAgICAgbGluZU51bWJlcjogOVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2hvbWUnXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgTmF2TGluayxcbiAgICAgICAgICB7IGV4YWN0OiB0cnVlLCB0bzogJy9jb3VudGVyJywgYWN0aXZlQ2xhc3NOYW1lOiAnYWN0aXZlJywgX19zb3VyY2U6IHtcbiAgICAgICAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgICAgICAgbGluZU51bWJlcjogMTBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgICdjb3VudGVyJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBOYXY7XG59KENvbXBvbmVudCk7XG5cbmV4cG9ydCBkZWZhdWx0IE5hdjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21tb24vY29tcG9uZW50cy9uYXYvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2NvbW1vbi9jb21wb25lbnRzL25hdi9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),

/***/ "./src/common/components/nav/style.css":
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(\"./node_modules/css-loader/lib/css-base.js\")(undefined);\n// imports\n\n\n// module\nexports.push([module.i, \"nav {\\r\\n  background: #f2f2f2;\\r\\n  display: block;\\r\\n  width: 100%;\\r\\n  float: left;\\r\\n  margin-bottom: 1.6em;\\r\\n}\\r\\n\\r\\nnav a {\\r\\n  display: inline-block;\\r\\n  padding: 1.6em;\\r\\n}\\r\\n\\r\\nnav a.active {\\r\\n  color: white;\\r\\n  font-weight: bold;\\r\\n  background: orange;\\r\\n}\\r\\n\", \"\"]);\n\n// exports\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvbmF2L3N0eWxlLmNzcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21tb24vY29tcG9uZW50cy9uYXYvc3R5bGUuY3NzPzBkMGEiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwibmF2IHtcXHJcXG4gIGJhY2tncm91bmQ6ICNmMmYyZjI7XFxyXFxuICBkaXNwbGF5OiBibG9jaztcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbiAgZmxvYXQ6IGxlZnQ7XFxyXFxuICBtYXJnaW4tYm90dG9tOiAxLjZlbTtcXHJcXG59XFxyXFxuXFxyXFxubmF2IGEge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgcGFkZGluZzogMS42ZW07XFxyXFxufVxcclxcblxcclxcbm5hdiBhLmFjdGl2ZSB7XFxyXFxuICBjb2xvcjogd2hpdGU7XFxyXFxuICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gIGJhY2tncm91bmQ6IG9yYW5nZTtcXHJcXG59XFxyXFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvbmF2L3N0eWxlLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvbmF2L3N0eWxlLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ "./src/common/components/pageHome/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);\nvar _jsxFileName = 'C:\\\\Users\\\\thekho.ngaosathe\\\\Desktop\\\\razzle-react-redux-starter\\\\src\\\\common\\\\components\\\\pageHome\\\\index.js';\n\n\nvar HomePage = function HomePage() {\n  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(\n    'div',\n    {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 4\n      }\n    },\n    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(\n      'h2',\n      {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 5\n        }\n      },\n      'Universal React with Razzle'\n    ),\n    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('br', {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 6\n      }\n    }),\n    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('img', { src: 'http://i1.sdlcdn.com/static/img/marketing-mailers/mailer/2016/x_999/awesome-thumbs-up.gif', alt: 'awesome', __source: {\n        fileName: _jsxFileName,\n        lineNumber: 7\n      }\n    }),\n    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('br', {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 8\n      }\n    }),\n    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('br', {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 9\n      }\n    }),\n    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(\n      'p',\n      {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 10\n        }\n      },\n      'Setting up a Universal React App is a pain. Using ',\n      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(\n        'a',\n        { href: 'https://github.com/jaredpalmer/razzle', __source: {\n            fileName: _jsxFileName,\n            lineNumber: 11\n          }\n        },\n        'Razzle'\n      ),\n      ' makes it simpler without overtly obfuscating what really goes on while performing server-side rendering. It\\'s pretty neat! ',\n      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('br', {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 12\n        }\n      }),\n      'Some lorem ipsom text. . . Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'\n    )\n  );\n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (HomePage);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvcGFnZUhvbWUvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvcGFnZUhvbWUvaW5kZXguanM/MWMyMSJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX2pzeEZpbGVOYW1lID0gJ0M6XFxcXFVzZXJzXFxcXHRoZWtoby5uZ2Fvc2F0aGVcXFxcRGVza3RvcFxcXFxyYXp6bGUtcmVhY3QtcmVkdXgtc3RhcnRlclxcXFxzcmNcXFxcY29tbW9uXFxcXGNvbXBvbmVudHNcXFxccGFnZUhvbWVcXFxcaW5kZXguanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxudmFyIEhvbWVQYWdlID0gZnVuY3Rpb24gSG9tZVBhZ2UoKSB7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICdkaXYnLFxuICAgIHtcbiAgICAgIF9fc291cmNlOiB7XG4gICAgICAgIGZpbGVOYW1lOiBfanN4RmlsZU5hbWUsXG4gICAgICAgIGxpbmVOdW1iZXI6IDRcbiAgICAgIH1cbiAgICB9LFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnaDInLFxuICAgICAge1xuICAgICAgICBfX3NvdXJjZToge1xuICAgICAgICAgIGZpbGVOYW1lOiBfanN4RmlsZU5hbWUsXG4gICAgICAgICAgbGluZU51bWJlcjogNVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ1VuaXZlcnNhbCBSZWFjdCB3aXRoIFJhenpsZSdcbiAgICApLFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2JyJywge1xuICAgICAgX19zb3VyY2U6IHtcbiAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgbGluZU51bWJlcjogNlxuICAgICAgfVxuICAgIH0pLFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2ltZycsIHsgc3JjOiAnaHR0cDovL2kxLnNkbGNkbi5jb20vc3RhdGljL2ltZy9tYXJrZXRpbmctbWFpbGVycy9tYWlsZXIvMjAxNi94Xzk5OS9hd2Vzb21lLXRodW1icy11cC5naWYnLCBhbHQ6ICdhd2Vzb21lJywgX19zb3VyY2U6IHtcbiAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgbGluZU51bWJlcjogN1xuICAgICAgfVxuICAgIH0pLFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2JyJywge1xuICAgICAgX19zb3VyY2U6IHtcbiAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgbGluZU51bWJlcjogOFxuICAgICAgfVxuICAgIH0pLFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2JyJywge1xuICAgICAgX19zb3VyY2U6IHtcbiAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgbGluZU51bWJlcjogOVxuICAgICAgfVxuICAgIH0pLFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAncCcsXG4gICAgICB7XG4gICAgICAgIF9fc291cmNlOiB7XG4gICAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgICBsaW5lTnVtYmVyOiAxMFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ1NldHRpbmcgdXAgYSBVbml2ZXJzYWwgUmVhY3QgQXBwIGlzIGEgcGFpbi4gVXNpbmcgJyxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdhJyxcbiAgICAgICAgeyBocmVmOiAnaHR0cHM6Ly9naXRodWIuY29tL2phcmVkcGFsbWVyL3JhenpsZScsIF9fc291cmNlOiB7XG4gICAgICAgICAgICBmaWxlTmFtZTogX2pzeEZpbGVOYW1lLFxuICAgICAgICAgICAgbGluZU51bWJlcjogMTFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdSYXp6bGUnXG4gICAgICApLFxuICAgICAgJyBtYWtlcyBpdCBzaW1wbGVyIHdpdGhvdXQgb3ZlcnRseSBvYmZ1c2NhdGluZyB3aGF0IHJlYWxseSBnb2VzIG9uIHdoaWxlIHBlcmZvcm1pbmcgc2VydmVyLXNpZGUgcmVuZGVyaW5nLiBJdFxcJ3MgcHJldHR5IG5lYXQhICcsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdicicsIHtcbiAgICAgICAgX19zb3VyY2U6IHtcbiAgICAgICAgICBmaWxlTmFtZTogX2pzeEZpbGVOYW1lLFxuICAgICAgICAgIGxpbmVOdW1iZXI6IDEyXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgJ1NvbWUgbG9yZW0gaXBzb20gdGV4dC4gLiAuIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0IGFuaW0gaWQgZXN0IGxhYm9ydW0uJ1xuICAgIClcbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEhvbWVQYWdlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbW1vbi9jb21wb25lbnRzL3BhZ2VIb21lL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9jb21tb24vY29tcG9uZW50cy9wYWdlSG9tZS9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),

/***/ "./src/common/components/routerComponentWrapperHOC/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__(1);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(3);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(5);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__style_css__ = __webpack_require__(\"./src/common/components/routerComponentWrapperHOC/style.css\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__style_css__);\n\n\n\n\n\nvar _jsxFileName = 'C:\\\\Users\\\\thekho.ngaosathe\\\\Desktop\\\\razzle-react-redux-starter\\\\src\\\\common\\\\components\\\\routerComponentWrapperHOC\\\\index.js';\n\n\n\nvar routerComponentWrapperHOC = function routerComponentWrapperHOC(ComposedComponent) {\n  return function (_Component) {\n    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(HOCcontainer, _Component);\n\n    function HOCcontainer() {\n      __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, HOCcontainer);\n\n      return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (HOCcontainer.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(HOCcontainer)).apply(this, arguments));\n    }\n\n    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(HOCcontainer, [{\n      key: 'render',\n      value: function render() {\n        return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(\n          'div',\n          { className: 'router-component-wrapper', __source: {\n              fileName: _jsxFileName,\n              lineNumber: 8\n            }\n          },\n          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(ComposedComponent, {\n            __source: {\n              fileName: _jsxFileName,\n              lineNumber: 9\n            }\n          })\n        );\n      }\n    }]);\n\n    return HOCcontainer;\n  }(__WEBPACK_IMPORTED_MODULE_5_react__[\"Component\"]);\n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (routerComponentWrapperHOC);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvcm91dGVyQ29tcG9uZW50V3JhcHBlckhPQy9pbmRleC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21tb24vY29tcG9uZW50cy9yb3V0ZXJDb21wb25lbnRXcmFwcGVySE9DL2luZGV4LmpzPzczOGMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9PYmplY3QkZ2V0UHJvdG90eXBlT2YgZnJvbSAnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mJztcbmltcG9ydCBfY2xhc3NDYWxsQ2hlY2sgZnJvbSAnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJztcbmltcG9ydCBfY3JlYXRlQ2xhc3MgZnJvbSAnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzJztcbmltcG9ydCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiBmcm9tICdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybic7XG5pbXBvcnQgX2luaGVyaXRzIGZyb20gJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cyc7XG52YXIgX2pzeEZpbGVOYW1lID0gJ0M6XFxcXFVzZXJzXFxcXHRoZWtoby5uZ2Fvc2F0aGVcXFxcRGVza3RvcFxcXFxyYXp6bGUtcmVhY3QtcmVkdXgtc3RhcnRlclxcXFxzcmNcXFxcY29tbW9uXFxcXGNvbXBvbmVudHNcXFxccm91dGVyQ29tcG9uZW50V3JhcHBlckhPQ1xcXFxpbmRleC5qcyc7XG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5cbnZhciByb3V0ZXJDb21wb25lbnRXcmFwcGVySE9DID0gZnVuY3Rpb24gcm91dGVyQ29tcG9uZW50V3JhcHBlckhPQyhDb21wb3NlZENvbXBvbmVudCkge1xuICByZXR1cm4gZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgICBfaW5oZXJpdHMoSE9DY29udGFpbmVyLCBfQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIEhPQ2NvbnRhaW5lcigpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBIT0Njb250YWluZXIpO1xuXG4gICAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKEhPQ2NvbnRhaW5lci5fX3Byb3RvX18gfHwgX09iamVjdCRnZXRQcm90b3R5cGVPZihIT0Njb250YWluZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoSE9DY29udGFpbmVyLCBbe1xuICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAncm91dGVyLWNvbXBvbmVudC13cmFwcGVyJywgX19zb3VyY2U6IHtcbiAgICAgICAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgICAgICAgbGluZU51bWJlcjogOFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21wb3NlZENvbXBvbmVudCwge1xuICAgICAgICAgICAgX19zb3VyY2U6IHtcbiAgICAgICAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgICAgICAgbGluZU51bWJlcjogOVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEhPQ2NvbnRhaW5lcjtcbiAgfShDb21wb25lbnQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyQ29tcG9uZW50V3JhcHBlckhPQztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21tb24vY29tcG9uZW50cy9yb3V0ZXJDb21wb25lbnRXcmFwcGVySE9DL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9jb21tb24vY29tcG9uZW50cy9yb3V0ZXJDb21wb25lbnRXcmFwcGVySE9DL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=");

/***/ }),

/***/ "./src/common/components/routerComponentWrapperHOC/style.css":
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(\"./node_modules/css-loader/lib/css-base.js\")(undefined);\n// imports\n\n\n// module\nexports.push([module.i, \".router-component-wrapper {\\r\\n  padding: 1em;\\r\\n  float: left;\\r\\n  width: 100%;\\r\\n}\\r\\n\", \"\"]);\n\n// exports\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvcm91dGVyQ29tcG9uZW50V3JhcHBlckhPQy9zdHlsZS5jc3MuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2NvbXBvbmVudHMvcm91dGVyQ29tcG9uZW50V3JhcHBlckhPQy9zdHlsZS5jc3M/ZmNiMyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIucm91dGVyLWNvbXBvbmVudC13cmFwcGVyIHtcXHJcXG4gIHBhZGRpbmc6IDFlbTtcXHJcXG4gIGZsb2F0OiBsZWZ0O1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxufVxcclxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbW1vbi9jb21wb25lbnRzL3JvdXRlckNvbXBvbmVudFdyYXBwZXJIT0Mvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9jb21tb24vY29tcG9uZW50cy9yb3V0ZXJDb21wb25lbnRXcmFwcGVySE9DL3N0eWxlLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ "./src/common/containers/App.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router_dom__ = __webpack_require__(6);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_counter__ = __webpack_require__(\"./src/common/components/counter/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_nav__ = __webpack_require__(\"./src/common/components/nav/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_pageHome__ = __webpack_require__(\"./src/common/components/pageHome/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_routerComponentWrapperHOC__ = __webpack_require__(\"./src/common/components/routerComponentWrapperHOC/index.js\");\nvar _jsxFileName = 'C:\\\\Users\\\\thekho.ngaosathe\\\\Desktop\\\\razzle-react-redux-starter\\\\src\\\\common\\\\containers\\\\App.js';\n\n\n\n\n\n\n\nvar App = function App() {\n  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(\n    'div',\n    {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 9\n      }\n    },\n    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__components_nav__[\"a\" /* default */], {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 10\n      }\n    }),\n    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('hr', {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 11\n      }\n    }),\n    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__[\"Route\"], { exact: true, path: '/', component: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__components_routerComponentWrapperHOC__[\"a\" /* default */])(__WEBPACK_IMPORTED_MODULE_4__components_pageHome__[\"a\" /* default */]), __source: {\n        fileName: _jsxFileName,\n        lineNumber: 12\n      }\n    }),\n    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__[\"Route\"], { exact: true, path: '/counter', component: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__components_routerComponentWrapperHOC__[\"a\" /* default */])(__WEBPACK_IMPORTED_MODULE_2__components_counter__[\"a\" /* default */]), __source: {\n        fileName: _jsxFileName,\n        lineNumber: 13\n      }\n    })\n  );\n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (App);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL2NvbnRhaW5lcnMvQXBwLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9jb250YWluZXJzL0FwcC5qcz9hMDZlIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfanN4RmlsZU5hbWUgPSAnQzpcXFxcVXNlcnNcXFxcdGhla2hvLm5nYW9zYXRoZVxcXFxEZXNrdG9wXFxcXHJhenpsZS1yZWFjdC1yZWR1eC1zdGFydGVyXFxcXHNyY1xcXFxjb21tb25cXFxcY29udGFpbmVyc1xcXFxBcHAuanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgQ291bnRlckNvbnRhaW5lciBmcm9tICcuLi9jb21wb25lbnRzL2NvdW50ZXInO1xuaW1wb3J0IE5hdiBmcm9tICcuLi9jb21wb25lbnRzL25hdic7XG5pbXBvcnQgSG9tZVBhZ2UgZnJvbSAnLi4vY29tcG9uZW50cy9wYWdlSG9tZSc7XG5pbXBvcnQgcm91dGVyQ29tcG9uZW50V3JhcHBlckhPQyBmcm9tICcuLi9jb21wb25lbnRzL3JvdXRlckNvbXBvbmVudFdyYXBwZXJIT0MnO1xuXG52YXIgQXBwID0gZnVuY3Rpb24gQXBwKCkge1xuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAnZGl2JyxcbiAgICB7XG4gICAgICBfX3NvdXJjZToge1xuICAgICAgICBmaWxlTmFtZTogX2pzeEZpbGVOYW1lLFxuICAgICAgICBsaW5lTnVtYmVyOiA5XG4gICAgICB9XG4gICAgfSxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdiwge1xuICAgICAgX19zb3VyY2U6IHtcbiAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgbGluZU51bWJlcjogMTBcbiAgICAgIH1cbiAgICB9KSxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdocicsIHtcbiAgICAgIF9fc291cmNlOiB7XG4gICAgICAgIGZpbGVOYW1lOiBfanN4RmlsZU5hbWUsXG4gICAgICAgIGxpbmVOdW1iZXI6IDExXG4gICAgICB9XG4gICAgfSksXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBleGFjdDogdHJ1ZSwgcGF0aDogJy8nLCBjb21wb25lbnQ6IHJvdXRlckNvbXBvbmVudFdyYXBwZXJIT0MoSG9tZVBhZ2UpLCBfX3NvdXJjZToge1xuICAgICAgICBmaWxlTmFtZTogX2pzeEZpbGVOYW1lLFxuICAgICAgICBsaW5lTnVtYmVyOiAxMlxuICAgICAgfVxuICAgIH0pLFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgZXhhY3Q6IHRydWUsIHBhdGg6ICcvY291bnRlcicsIGNvbXBvbmVudDogcm91dGVyQ29tcG9uZW50V3JhcHBlckhPQyhDb3VudGVyQ29udGFpbmVyKSwgX19zb3VyY2U6IHtcbiAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgbGluZU51bWJlcjogMTNcbiAgICAgIH1cbiAgICB9KVxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbW1vbi9jb250YWluZXJzL0FwcC5qc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvY29tbW9uL2NvbnRhaW5lcnMvQXBwLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ "./src/common/modules/fetchCount.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_es6_promise__ = __webpack_require__(12);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_es6_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_es6_promise__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__ = __webpack_require__(13);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__);\n\n\n__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_es6_promise__[\"polyfill\"])();\n\nvar fetchCount = function fetchCount(callback) {\n  fetch('https://59257e8a21cf650011fddc9b.mockapi.io/counter/count/count/1').then(function (res) {\n    return res.json();\n  }).then(function (count) {\n    var result = count.count;\n    // console.log('count from fetch request:', result);\n    callback(result);\n  }).catch(function (err) {\n    console.log('error in fetchCounter: ', err);\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (fetchCount);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL21vZHVsZXMvZmV0Y2hDb3VudC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21tb24vbW9kdWxlcy9mZXRjaENvdW50LmpzPzA1NGQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcG9seWZpbGwgfSBmcm9tICdlczYtcHJvbWlzZSc7XG5pbXBvcnQgJ2lzb21vcnBoaWMtZmV0Y2gnO1xucG9seWZpbGwoKTtcblxudmFyIGZldGNoQ291bnQgPSBmdW5jdGlvbiBmZXRjaENvdW50KGNhbGxiYWNrKSB7XG4gIGZldGNoKCdodHRwczovLzU5MjU3ZThhMjFjZjY1MDAxMWZkZGM5Yi5tb2NrYXBpLmlvL2NvdW50ZXIvY291bnQvY291bnQvMScpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgIHJldHVybiByZXMuanNvbigpO1xuICB9KS50aGVuKGZ1bmN0aW9uIChjb3VudCkge1xuICAgIHZhciByZXN1bHQgPSBjb3VudC5jb3VudDtcbiAgICAvLyBjb25zb2xlLmxvZygnY291bnQgZnJvbSBmZXRjaCByZXF1ZXN0OicsIHJlc3VsdCk7XG4gICAgY2FsbGJhY2socmVzdWx0KTtcbiAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgIGNvbnNvbGUubG9nKCdlcnJvciBpbiBmZXRjaENvdW50ZXI6ICcsIGVycik7XG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZmV0Y2hDb3VudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21tb24vbW9kdWxlcy9mZXRjaENvdW50LmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9jb21tb24vbW9kdWxlcy9mZXRjaENvdW50LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ "./src/common/modules/fetchPutCounter.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);\n\nvar url = 'https://59257e8a21cf650011fddc9b.mockapi.io/counter/count/count';\n\nvar fetchPutCounter = function fetchPutCounter(value) {\n  return fetch(url + '/1', {\n    method: 'PUT',\n    headers: {\n      'Accept': 'application/json, text/plain, */*',\n      'Content-Type': 'application/json'\n    },\n    body: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({\n      'count': value\n    })\n  }).then(function (res) {\n    return res.json();\n  }).then(function (res) {\n    console.log('PUT response: ', res);\n  }).catch(function (err) {\n    console.log('err in PUT: ', err);\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (fetchPutCounter);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL21vZHVsZXMvZmV0Y2hQdXRDb3VudGVyLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9tb2R1bGVzL2ZldGNoUHV0Q291bnRlci5qcz8wMDg5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfSlNPTiRzdHJpbmdpZnkgZnJvbSAnYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5JztcbnZhciB1cmwgPSAnaHR0cHM6Ly81OTI1N2U4YTIxY2Y2NTAwMTFmZGRjOWIubW9ja2FwaS5pby9jb3VudGVyL2NvdW50L2NvdW50JztcblxudmFyIGZldGNoUHV0Q291bnRlciA9IGZ1bmN0aW9uIGZldGNoUHV0Q291bnRlcih2YWx1ZSkge1xuICByZXR1cm4gZmV0Y2godXJsICsgJy8xJywge1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH0sXG4gICAgYm9keTogX0pTT04kc3RyaW5naWZ5KHtcbiAgICAgICdjb3VudCc6IHZhbHVlXG4gICAgfSlcbiAgfSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgIGNvbnNvbGUubG9nKCdQVVQgcmVzcG9uc2U6ICcsIHJlcyk7XG4gIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICBjb25zb2xlLmxvZygnZXJyIGluIFBVVDogJywgZXJyKTtcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmZXRjaFB1dENvdW50ZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tbW9uL21vZHVsZXMvZmV0Y2hQdXRDb3VudGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9jb21tb24vbW9kdWxlcy9mZXRjaFB1dENvdW50ZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),

/***/ "./src/common/modules/getCounterLocalStorage.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__localStorageSupport__ = __webpack_require__(\"./src/common/modules/localStorageSupport.js\");\n\n\nvar getCounterLocalStorage = function getCounterLocalStorage(count) {\n  if (!__WEBPACK_IMPORTED_MODULE_0__localStorageSupport__[\"a\" /* default */]) {\n    return false;\n  } else {\n    var _count = window.localStorage.getItem('__counter__');\n    console.log('found in localStorage: ', _count);\n    return _count;\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (getCounterLocalStorage);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL21vZHVsZXMvZ2V0Q291bnRlckxvY2FsU3RvcmFnZS5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21tb24vbW9kdWxlcy9nZXRDb3VudGVyTG9jYWxTdG9yYWdlLmpzPzFmMjgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxvY2FsU3RvcmFnZVN1cHBvcnQgZnJvbSAnLi9sb2NhbFN0b3JhZ2VTdXBwb3J0JztcblxudmFyIGdldENvdW50ZXJMb2NhbFN0b3JhZ2UgPSBmdW5jdGlvbiBnZXRDb3VudGVyTG9jYWxTdG9yYWdlKGNvdW50KSB7XG4gIGlmICghbG9jYWxTdG9yYWdlU3VwcG9ydCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgX2NvdW50ID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfX2NvdW50ZXJfXycpO1xuICAgIGNvbnNvbGUubG9nKCdmb3VuZCBpbiBsb2NhbFN0b3JhZ2U6ICcsIF9jb3VudCk7XG4gICAgcmV0dXJuIF9jb3VudDtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0Q291bnRlckxvY2FsU3RvcmFnZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21tb24vbW9kdWxlcy9nZXRDb3VudGVyTG9jYWxTdG9yYWdlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9jb21tb24vbW9kdWxlcy9nZXRDb3VudGVyTG9jYWxTdG9yYWdlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),

/***/ "./src/common/modules/localStorageSupport.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("var localStorageSupported = function localStorageSupported(type) {\n  try {\n    var storage = window[type];\n    var x = '__storage_test__';\n    storage.setItem(x, x);\n    storage.removeItem(x);\n    return true;\n  } catch (e) {\n    return false;\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (localStorageSupported);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL21vZHVsZXMvbG9jYWxTdG9yYWdlU3VwcG9ydC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21tb24vbW9kdWxlcy9sb2NhbFN0b3JhZ2VTdXBwb3J0LmpzP2Y5NTQiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGxvY2FsU3RvcmFnZVN1cHBvcnRlZCA9IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVN1cHBvcnRlZCh0eXBlKSB7XG4gIHRyeSB7XG4gICAgdmFyIHN0b3JhZ2UgPSB3aW5kb3dbdHlwZV07XG4gICAgdmFyIHggPSAnX19zdG9yYWdlX3Rlc3RfXyc7XG4gICAgc3RvcmFnZS5zZXRJdGVtKHgsIHgpO1xuICAgIHN0b3JhZ2UucmVtb3ZlSXRlbSh4KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgbG9jYWxTdG9yYWdlU3VwcG9ydGVkO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbW1vbi9tb2R1bGVzL2xvY2FsU3RvcmFnZVN1cHBvcnQuanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2NvbW1vbi9tb2R1bGVzL2xvY2FsU3RvcmFnZVN1cHBvcnQuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),

/***/ "./src/common/modules/setCounterLocalStorage.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__localStorageSupport__ = __webpack_require__(\"./src/common/modules/localStorageSupport.js\");\n\n\nvar setCounterLocalStorage = function setCounterLocalStorage(count) {\n  if (!__WEBPACK_IMPORTED_MODULE_0__localStorageSupport__[\"a\" /* default */]) {\n    return false;\n  } else {\n    window.localStorage.setItem('__counter__', count);\n    console.log('stored in localStorage');\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (setCounterLocalStorage);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL21vZHVsZXMvc2V0Q291bnRlckxvY2FsU3RvcmFnZS5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21tb24vbW9kdWxlcy9zZXRDb3VudGVyTG9jYWxTdG9yYWdlLmpzP2IxNmYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxvY2FsU3RvcmFnZVN1cHBvcnQgZnJvbSAnLi9sb2NhbFN0b3JhZ2VTdXBwb3J0JztcblxudmFyIHNldENvdW50ZXJMb2NhbFN0b3JhZ2UgPSBmdW5jdGlvbiBzZXRDb3VudGVyTG9jYWxTdG9yYWdlKGNvdW50KSB7XG4gIGlmICghbG9jYWxTdG9yYWdlU3VwcG9ydCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ19fY291bnRlcl9fJywgY291bnQpO1xuICAgIGNvbnNvbGUubG9nKCdzdG9yZWQgaW4gbG9jYWxTdG9yYWdlJyk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNldENvdW50ZXJMb2NhbFN0b3JhZ2U7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tbW9uL21vZHVsZXMvc2V0Q291bnRlckxvY2FsU3RvcmFnZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvY29tbW9uL21vZHVsZXMvc2V0Q291bnRlckxvY2FsU3RvcmFnZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ "./src/common/reducers/counter.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions__ = __webpack_require__(\"./src/common/actions/index.js\");\n\n\nvar counter = function counter() {\n  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n  var action = arguments[1];\n\n  switch (action.type) {\n    case __WEBPACK_IMPORTED_MODULE_0__actions__[\"SET_COUNTER\"]:\n      return action.payload;\n    case __WEBPACK_IMPORTED_MODULE_0__actions__[\"INCREMENT_COUNTER\"]:\n      return state + 1;\n    case __WEBPACK_IMPORTED_MODULE_0__actions__[\"DECREMENT_COUNTER\"]:\n      return state - 1;\n    default:\n      return state;\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (counter);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL3JlZHVjZXJzL2NvdW50ZXIuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3JlZHVjZXJzL2NvdW50ZXIuanM/OTk2NyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTRVRfQ09VTlRFUiwgSU5DUkVNRU5UX0NPVU5URVIsIERFQ1JFTUVOVF9DT1VOVEVSIH0gZnJvbSAnLi4vYWN0aW9ucyc7XG5cbnZhciBjb3VudGVyID0gZnVuY3Rpb24gY291bnRlcigpIHtcbiAgdmFyIHN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICB2YXIgYWN0aW9uID0gYXJndW1lbnRzWzFdO1xuXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIFNFVF9DT1VOVEVSOlxuICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xuICAgIGNhc2UgSU5DUkVNRU5UX0NPVU5URVI6XG4gICAgICByZXR1cm4gc3RhdGUgKyAxO1xuICAgIGNhc2UgREVDUkVNRU5UX0NPVU5URVI6XG4gICAgICByZXR1cm4gc3RhdGUgLSAxO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvdW50ZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tbW9uL3JlZHVjZXJzL2NvdW50ZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2NvbW1vbi9yZWR1Y2Vycy9jb3VudGVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),

/***/ "./src/common/reducers/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(7);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__counter__ = __webpack_require__(\"./src/common/reducers/counter.js\");\n\n\n\nvar rootReducer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__[\"combineReducers\"])({\n  counter: __WEBPACK_IMPORTED_MODULE_1__counter__[\"a\" /* default */]\n});\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (rootReducer);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL3JlZHVjZXJzL2luZGV4LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9yZWR1Y2Vycy9pbmRleC5qcz8yNzFjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBjb3VudGVyIGZyb20gJy4vY291bnRlcic7XG5cbnZhciByb290UmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gIGNvdW50ZXI6IGNvdW50ZXJcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCByb290UmVkdWNlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21tb24vcmVkdWNlcnMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2NvbW1vbi9yZWR1Y2Vycy9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),

/***/ "./src/common/store/configureStore.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof__ = __webpack_require__(11);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux__ = __webpack_require__(7);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_redux_thunk__ = __webpack_require__(17);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_redux_thunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_redux_thunk__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers__ = __webpack_require__(\"./src/common/reducers/index.js\");\n\n\n\n\n\n// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;\n\nvar composeEnhancers = (typeof window === 'undefined' ? 'undefined' : __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof___default()(window)) === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({\n  // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...\n}) : __WEBPACK_IMPORTED_MODULE_1_redux__[\"compose\"];\nvar enhancer = composeEnhancers(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_redux__[\"applyMiddleware\"])(__WEBPACK_IMPORTED_MODULE_2_redux_thunk___default.a));\n\nvar configureStore = function configureStore(preloadedState) {\n  // const store = createStore(\n  //   rootReducer,\n  //   preloadedState,\n  //   applyMiddleware(thunk)\n  // );\n  var store = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_redux__[\"createStore\"])(__WEBPACK_IMPORTED_MODULE_3__reducers__[\"default\"], preloadedState, enhancer);\n\n  if (true) {\n    // Enable Webpack hot module replacement for reducers\n    module.hot.accept(\"./src/common/reducers/index.js\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ __WEBPACK_IMPORTED_MODULE_3__reducers__ = __webpack_require__(\"./src/common/reducers/index.js\"); (function () {\n      var nextRootReducer = __webpack_require__(\"./src/common/reducers/index.js\").default;\n      store.replaceReducer(nextRootReducer);\n    })(__WEBPACK_OUTDATED_DEPENDENCIES__); });\n  }\n\n  return store;\n};\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (configureStore);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL3N0b3JlL2NvbmZpZ3VyZVN0b3JlLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9zdG9yZS9jb25maWd1cmVTdG9yZS5qcz9kOGE0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfdHlwZW9mIGZyb20gJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy90eXBlb2YnO1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSwgY29tcG9zZSB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCB0aHVuayBmcm9tICdyZWR1eC10aHVuayc7XG5pbXBvcnQgcm9vdFJlZHVjZXIgZnJvbSAnLi4vcmVkdWNlcnMnO1xuXG4vLyBjb25zdCBjb21wb3NlRW5oYW5jZXJzID0gd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyB8fCBjb21wb3NlO1xuXG52YXIgY29tcG9zZUVuaGFuY2VycyA9ICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih3aW5kb3cpKSA9PT0gJ29iamVjdCcgJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyA/IHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9DT01QT1NFX18oe1xuICAvLyBTcGVjaWZ5IGV4dGVuc2lvbuKAmXMgb3B0aW9ucyBsaWtlIG5hbWUsIGFjdGlvbnNCbGFja2xpc3QsIGFjdGlvbnNDcmVhdG9ycywgc2VyaWFsaXplLi4uXG59KSA6IGNvbXBvc2U7XG52YXIgZW5oYW5jZXIgPSBjb21wb3NlRW5oYW5jZXJzKGFwcGx5TWlkZGxld2FyZSh0aHVuaykpO1xuXG52YXIgY29uZmlndXJlU3RvcmUgPSBmdW5jdGlvbiBjb25maWd1cmVTdG9yZShwcmVsb2FkZWRTdGF0ZSkge1xuICAvLyBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxuICAvLyAgIHJvb3RSZWR1Y2VyLFxuICAvLyAgIHByZWxvYWRlZFN0YXRlLFxuICAvLyAgIGFwcGx5TWlkZGxld2FyZSh0aHVuaylcbiAgLy8gKTtcbiAgdmFyIHN0b3JlID0gY3JlYXRlU3RvcmUocm9vdFJlZHVjZXIsIHByZWxvYWRlZFN0YXRlLCBlbmhhbmNlcik7XG5cbiAgaWYgKG1vZHVsZS5ob3QpIHtcbiAgICAvLyBFbmFibGUgV2VicGFjayBob3QgbW9kdWxlIHJlcGxhY2VtZW50IGZvciByZWR1Y2Vyc1xuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCcuLi9yZWR1Y2VycycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuZXh0Um9vdFJlZHVjZXIgPSByZXF1aXJlKCcuLi9yZWR1Y2VycycpLmRlZmF1bHQ7XG4gICAgICBzdG9yZS5yZXBsYWNlUmVkdWNlcihuZXh0Um9vdFJlZHVjZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHN0b3JlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlndXJlU3RvcmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tbW9uL3N0b3JlL2NvbmZpZ3VyZVN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9jb21tb24vc3RvcmUvY29uZmlndXJlU3RvcmUuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=");

/***/ }),

/***/ "./src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(8);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__server__ = __webpack_require__(\"./src/server/index.js\");\n\n\n\nif (true) {\n  module.hot.accept(\"./src/server/index.js\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ __WEBPACK_IMPORTED_MODULE_1__server__ = __webpack_require__(\"./src/server/index.js\"); (function () {\n    console.log('🔁  HMR Reloading `./server`...');\n  })(__WEBPACK_OUTDATED_DEPENDENCIES__); });\n  console.info('✅  Server-side HMR Enabled!');\n}\n\nvar port = 3000 || 3000;\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (__WEBPACK_IMPORTED_MODULE_0_express___default()().use(function (req, res) {\n  return __WEBPACK_IMPORTED_MODULE_1__server__[\"default\"].handle(req, res);\n}).listen(port, function (err) {\n  if (err) {\n    console.error(err);\n    return;\n  }\n  console.log('> Started on port ' + port);\n}));//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/N2YxNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBhcHAgZnJvbSAnLi9zZXJ2ZXInO1xuXG5pZiAobW9kdWxlLmhvdCkge1xuICBtb2R1bGUuaG90LmFjY2VwdCgnLi9zZXJ2ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ/CflIEgIEhNUiBSZWxvYWRpbmcgYC4vc2VydmVyYC4uLicpO1xuICB9KTtcbiAgY29uc29sZS5pbmZvKCfinIUgIFNlcnZlci1zaWRlIEhNUiBFbmFibGVkIScpO1xufVxuXG52YXIgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMzAwMDtcblxuZXhwb3J0IGRlZmF1bHQgZXhwcmVzcygpLnVzZShmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgcmV0dXJuIGFwcC5oYW5kbGUocmVxLCByZXMpO1xufSkubGlzdGVuKHBvcnQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgaWYgKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc29sZS5sb2coJz4gU3RhcnRlZCBvbiBwb3J0ICcgKyBwb3J0KTtcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ "./src/server/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(8);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path__ = __webpack_require__(14);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_path__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_qs__ = __webpack_require__(15);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_qs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_qs__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_serialize_javascript__ = __webpack_require__(18);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_serialize_javascript___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_serialize_javascript__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom_server__ = __webpack_require__(16);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_dom_server__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_redux__ = __webpack_require__(9);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_redux__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__common_store_configureStore__ = __webpack_require__(\"./src/common/store/configureStore.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__common_containers_App__ = __webpack_require__(\"./src/common/containers/App.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__common_api_counter__ = __webpack_require__(\"./src/common/api/counter.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_react_router_dom__ = __webpack_require__(6);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_react_router_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_react_router_dom__);\nvar _jsxFileName = 'C:\\\\Users\\\\thekho.ngaosathe\\\\Desktop\\\\razzle-react-redux-starter\\\\src\\\\server\\\\index.js';\n\n\n\n\n\n\n\n\n\n\n\n\nvar assets = __webpack_require__(\"./build/assets.json\");\nvar server = __WEBPACK_IMPORTED_MODULE_0_express___default()();\n\nserver.disable('x-powered-by').use(__WEBPACK_IMPORTED_MODULE_0_express___default.a.static(\"C:\\\\Users\\\\thekho.ngaosathe\\\\Desktop\\\\razzle-react-redux-starter\\\\public\")).get('/*', function (req, res) {\n  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__common_api_counter__[\"a\" /* fetchCounter */])(function (apiResult) {\n    var context = {};\n    // Read the counter from the request, if provided\n    // console.log('apiResult: ', apiResult);\n    var params = __WEBPACK_IMPORTED_MODULE_3_qs___default.a.parse(req.query);\n    var counter = parseInt(params.counter, 10) || apiResult || 0;\n    // Compile an initial state\n    var preloadedState = { counter: counter };\n    // Create a new Redux store instance\n    var store = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__common_store_configureStore__[\"a\" /* default */])(preloadedState);\n    // Render the component to a string\n    var markup = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_react_dom_server__[\"renderToString\"])(__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(\n      __WEBPACK_IMPORTED_MODULE_6_react_redux__[\"Provider\"],\n      { store: store, __source: {\n          fileName: _jsxFileName,\n          lineNumber: 32\n        }\n      },\n      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(\n        __WEBPACK_IMPORTED_MODULE_10_react_router_dom__[\"StaticRouter\"],\n        { context: context, location: req.url, __source: {\n            fileName: _jsxFileName,\n            lineNumber: 33\n          }\n        },\n        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__common_containers_App__[\"a\" /* default */], {\n          __source: {\n            fileName: _jsxFileName,\n            lineNumber: 34\n          }\n        })\n      )\n    ));\n    // Grab the initial state from our Redux store\n    var finalState = store.getState();\n    res.send('<!doctype html>\\n    <html lang=\"\">\\n    <head>\\n        <meta httpEquiv=\"X-UA-Compatible\" content=\"IE=edge\" />\\n        <meta charSet=\\'utf-8\\' />\\n        <title>Razzle Redux Example</title>\\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\\n        ' + (assets.client.css ? '<link rel=\"stylesheet\" href=\"' + assets.client.css + '\">' : '') + '\\n        <script src=\"' + assets.client.js + '\" defer></script>\\n    </head>\\n    <body>\\n        <div id=\"root\">' + markup + '</div>\\n        <script>\\n          window.__PRELOADED_STATE__ = ' + __WEBPACK_IMPORTED_MODULE_4_serialize_javascript___default()(finalState) + '\\n        </script>\\n    </body>\\n</html>');\n  });\n});\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (server);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2VydmVyL2luZGV4LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci9pbmRleC5qcz9kNzY4Il0sInNvdXJjZXNDb250ZW50IjpbInZhciBfanN4RmlsZU5hbWUgPSAnQzpcXFxcVXNlcnNcXFxcdGhla2hvLm5nYW9zYXRoZVxcXFxEZXNrdG9wXFxcXHJhenpsZS1yZWFjdC1yZWR1eC1zdGFydGVyXFxcXHNyY1xcXFxzZXJ2ZXJcXFxcaW5kZXguanMnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgcXMgZnJvbSAncXMnO1xuaW1wb3J0IHNlcmlhbGl6ZSBmcm9tICdzZXJpYWxpemUtamF2YXNjcmlwdCc7XG5pbXBvcnQgeyByZW5kZXJUb1N0cmluZyB9IGZyb20gJ3JlYWN0LWRvbS9zZXJ2ZXInO1xuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmltcG9ydCBjb25maWd1cmVTdG9yZSBmcm9tICcuLi9jb21tb24vc3RvcmUvY29uZmlndXJlU3RvcmUnO1xuaW1wb3J0IEFwcCBmcm9tICcuLi9jb21tb24vY29udGFpbmVycy9BcHAnO1xuaW1wb3J0IHsgZmV0Y2hDb3VudGVyIH0gZnJvbSAnLi4vY29tbW9uL2FwaS9jb3VudGVyJztcbmltcG9ydCB7IFN0YXRpY1JvdXRlciwgbWF0Y2hQYXRoIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG52YXIgYXNzZXRzID0gcmVxdWlyZShwcm9jZXNzLmVudi5SQVpaTEVfQVNTRVRTX01BTklGRVNUKTtcbnZhciBzZXJ2ZXIgPSBleHByZXNzKCk7XG5cbnNlcnZlci5kaXNhYmxlKCd4LXBvd2VyZWQtYnknKS51c2UoZXhwcmVzcy5zdGF0aWMocHJvY2Vzcy5lbnYuUkFaWkxFX1BVQkxJQ19ESVIpKS5nZXQoJy8qJywgZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gIGZldGNoQ291bnRlcihmdW5jdGlvbiAoYXBpUmVzdWx0KSB7XG4gICAgdmFyIGNvbnRleHQgPSB7fTtcbiAgICAvLyBSZWFkIHRoZSBjb3VudGVyIGZyb20gdGhlIHJlcXVlc3QsIGlmIHByb3ZpZGVkXG4gICAgLy8gY29uc29sZS5sb2coJ2FwaVJlc3VsdDogJywgYXBpUmVzdWx0KTtcbiAgICB2YXIgcGFyYW1zID0gcXMucGFyc2UocmVxLnF1ZXJ5KTtcbiAgICB2YXIgY291bnRlciA9IHBhcnNlSW50KHBhcmFtcy5jb3VudGVyLCAxMCkgfHwgYXBpUmVzdWx0IHx8IDA7XG4gICAgLy8gQ29tcGlsZSBhbiBpbml0aWFsIHN0YXRlXG4gICAgdmFyIHByZWxvYWRlZFN0YXRlID0geyBjb3VudGVyOiBjb3VudGVyIH07XG4gICAgLy8gQ3JlYXRlIGEgbmV3IFJlZHV4IHN0b3JlIGluc3RhbmNlXG4gICAgdmFyIHN0b3JlID0gY29uZmlndXJlU3RvcmUocHJlbG9hZGVkU3RhdGUpO1xuICAgIC8vIFJlbmRlciB0aGUgY29tcG9uZW50IHRvIGEgc3RyaW5nXG4gICAgdmFyIG1hcmt1cCA9IHJlbmRlclRvU3RyaW5nKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBQcm92aWRlcixcbiAgICAgIHsgc3RvcmU6IHN0b3JlLCBfX3NvdXJjZToge1xuICAgICAgICAgIGZpbGVOYW1lOiBfanN4RmlsZU5hbWUsXG4gICAgICAgICAgbGluZU51bWJlcjogMzJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFN0YXRpY1JvdXRlcixcbiAgICAgICAgeyBjb250ZXh0OiBjb250ZXh0LCBsb2NhdGlvbjogcmVxLnVybCwgX19zb3VyY2U6IHtcbiAgICAgICAgICAgIGZpbGVOYW1lOiBfanN4RmlsZU5hbWUsXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiAzM1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChBcHAsIHtcbiAgICAgICAgICBfX3NvdXJjZToge1xuICAgICAgICAgICAgZmlsZU5hbWU6IF9qc3hGaWxlTmFtZSxcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IDM0XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgICkpO1xuICAgIC8vIEdyYWIgdGhlIGluaXRpYWwgc3RhdGUgZnJvbSBvdXIgUmVkdXggc3RvcmVcbiAgICB2YXIgZmluYWxTdGF0ZSA9IHN0b3JlLmdldFN0YXRlKCk7XG4gICAgcmVzLnNlbmQoJzwhZG9jdHlwZSBodG1sPlxcbiAgICA8aHRtbCBsYW5nPVwiXCI+XFxuICAgIDxoZWFkPlxcbiAgICAgICAgPG1ldGEgaHR0cEVxdWl2PVwiWC1VQS1Db21wYXRpYmxlXCIgY29udGVudD1cIklFPWVkZ2VcIiAvPlxcbiAgICAgICAgPG1ldGEgY2hhclNldD1cXCd1dGYtOFxcJyAvPlxcbiAgICAgICAgPHRpdGxlPlJhenpsZSBSZWR1eCBFeGFtcGxlPC90aXRsZT5cXG4gICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MVwiPlxcbiAgICAgICAgJyArIChhc3NldHMuY2xpZW50LmNzcyA/ICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIicgKyBhc3NldHMuY2xpZW50LmNzcyArICdcIj4nIDogJycpICsgJ1xcbiAgICAgICAgPHNjcmlwdCBzcmM9XCInICsgYXNzZXRzLmNsaWVudC5qcyArICdcIiBkZWZlcj48L3NjcmlwdD5cXG4gICAgPC9oZWFkPlxcbiAgICA8Ym9keT5cXG4gICAgICAgIDxkaXYgaWQ9XCJyb290XCI+JyArIG1hcmt1cCArICc8L2Rpdj5cXG4gICAgICAgIDxzY3JpcHQ+XFxuICAgICAgICAgIHdpbmRvdy5fX1BSRUxPQURFRF9TVEFURV9fID0gJyArIHNlcmlhbGl6ZShmaW5hbFN0YXRlKSArICdcXG4gICAgICAgIDwvc2NyaXB0PlxcbiAgICA8L2JvZHk+XFxuPC9odG1sPicpO1xuICB9KTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2VydmVyL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9zZXJ2ZXIvaW5kZXguanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/get-prototype-of");

/***/ }),

/***/ 10:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),

/***/ 11:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/typeof");

/***/ }),

/***/ 12:
/***/ (function(module, exports) {

module.exports = require("es6-promise");

/***/ }),

/***/ 13:
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),

/***/ 14:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 15:
/***/ (function(module, exports) {

module.exports = require("qs");

/***/ }),

/***/ 16:
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ 17:
/***/ (function(module, exports) {

module.exports = require("redux-thunk");

/***/ }),

/***/ 18:
/***/ (function(module, exports) {

module.exports = require("serialize-javascript");

/***/ }),

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/webpack/hot/poll.js?300");
module.exports = __webpack_require__("./src/index.js");


/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/createClass");

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/inherits");

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/possibleConstructorReturn");

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ })

/******/ });
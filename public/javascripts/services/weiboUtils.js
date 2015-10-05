/**
 * Created by Tink on 2015/10/4.
 */

'use strict';

angular.module('app').factory('weiboUtils', function ($http) {
    return {
        findOneAndIndexWithProp: function (arr, prop, rhs) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][prop] === rhs) {
                    return {
                        element: arr[i],
                        index: i
                    };
                }
            }
            return null;
        },
        findOneAndIndex: function(arr, rhs){
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === rhs) {
                    return {
                        element: arr[i],
                        index: i
                    };
                }
            }
            return null;
        },
        findListAndIndexes: function(arr, rhs){
            var results = [];
            var elements = [];
            var indexes = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === rhs) {
                    results.push({
                        element: arr[i],
                        index: i
                    });
                    elements.push(arr[i]);
                    indexes.push(i);
                }
            }
            if(results.length === 0){
                return null;
            }
            return {
                results: results,
                elements: elements,
                indexes: indexes
            };
        },
        findListAndIndexesWithProp: function(arr, prop, rhs){
            var results = [];
            var elements = [];
            var indexes = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][prop] === rhs) {
                    results.push({
                        element: arr[i],
                        index: i
                    });
                    elements.push(arr[i]);
                    indexes.push(i);
                }
            }
            if(results.length === 0){
                return null;
            }
            return {
                results: results,
                elements: elements,
                indexes: indexes
            };
        },
        updateOne: function(arr, rhs, updateProp, updateVal){
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === rhs) {
                    arr[i][updateProp] = updateVal;
                    break;
                }
            }
        },
        updateOneWithProp: function(arr, prop, rhs, updateProp, updateVal){
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][prop] === rhs) {
                    arr[i][updateProp] = updateVal;
                    break;
                }
            }
        }
    }
});
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
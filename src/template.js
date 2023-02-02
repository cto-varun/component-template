import React, { useEffect, useState } from 'react';
import * as sqrl from 'squirrelly';
import './styles.css';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

const { hasOwnProperty } = Object.prototype;

export default function templateComponent(props) {
    const {
        properties,
        component,
        data = [],
        store = {},
        responseData = [],
        loading = undefined,
        error = undefined,
        payload = undefined,
        templateClassName,
        workflow = [],
    } = props;

    const { template = '', configTextObject = {} } = properties;

    const copyToClipBoard = (phoneNumber) => {
        const el = document.createElement('textarea');
        el.value = phoneNumber;
        el.setAttribute('readonly', '');
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    useEffect(() => {
        if (component && component.id) {
            window[window.sessionStorage?.tabId][`${component.id}copyToClipBoard`] = (value) =>
                copyToClipBoard(value);
        }

        return () => {
            if (component && component.id) {
                delete window[window.sessionStorage?.tabId][`${component.id}copyToClipBoard`];
            }
        };
    });

    const templateHTML = (input, inputData) => {
        const html = input;
        try {
            return sqrl.Render(html, inputData || []);
        } catch (e) {
            return `Squirrelly Error: ${e}`;
        }
    };

    function createHTML(input, inputData = []) {
        if (input === '') {
            return { __html: '' };
        }
        return { __html: templateHTML(input, inputData) };
    }

    const [externalData, updateExternalData] = useState({});

    const [updateTemplateCount, setUpdateTemplateCount] = useState(0);

    function updateTemplateData(input, shouldOverwrite = false) {
        const clonedOldObj = cloneDeep(externalData);
        let mergedObj;
        // If the input is an object, merge it with the existing object.
        if (typeof input === 'object') {
            if (shouldOverwrite) {
                mergedObj = input;
            } else {
                mergedObj = merge(clonedOldObj, input);
            }
        }
        // Otherwise increment the count by one and assign the input to that key.
        else {
            mergedObj = merge(clonedOldObj, { [updateTemplateCount]: input });
            setUpdateTemplateCount(updateTemplateCount + 1);
        }
        updateExternalData(mergedObj);
    }

    useEffect(() => {
        if (workflow.length > 0) {
            workflow.map((item) => {
                if (hasOwnProperty.call(item, 'didMountWorkflowData')) {
                    updateTemplateData(item.didMountWorkflowData);
                }
                return item;
            });
        }
    }, []);

    function resetTemplateData() {
        updateExternalData({});
        setUpdateTemplateCount(0);
    }

    useEffect(() => {
        if (component && component.id) {
            window[window.sessionStorage?.tabId][`${component.id}updateTemplateData`] = updateTemplateData;
            window[window.sessionStorage?.tabId][`${component.id}resetTemplateData`] = resetTemplateData;
        }

        return () => {
            if (component && component.id) {
                delete window[window.sessionStorage?.tabId][`${component.id}updateTemplateData`];
                delete window[window.sessionStorage?.tabId][`${component.id}resetTemplateData`];
            }
        };
    });

    let __html = createHTML(template, {
        data,
        externalData,
        responseData,
        store,
        configTextObject,
        loading,
        error,
        payload,
    });

    useEffect(() => {
        __html = createHTML(template, {
            data,
            externalData,
            responseData,
            store,
            configTextObject,
            loading,
            error,
            payload,
        });
    }, [externalData]);

    return (
        <>
            <div
                className={
                    templateClassName && templateClassName
                        ? templateClassName
                        : 'template-component'
                }
                dangerouslySetInnerHTML={__html}
            />
        </>
    );
}

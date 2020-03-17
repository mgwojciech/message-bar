/// <reference types="mocha" />

import * as React from 'react';
import { assert } from 'chai';
import { mount, configure } from 'enzyme';
import { SPHttpClient } from "@microsoft/sp-http";
import Adapter from 'enzyme-adapter-react-16';
import { SPMessageBarComponent } from '../src/components/SPMessageBarComponent';

declare const jest;
configure({ adapter: new Adapter() });

//mock configuration
jest.mock("@microsoft/sp-http", () => {
    return {
        SPHttpClient: {
            configurations: {
                v1: 1
            }
        }
    }
});
let mockedSPContext = {
    pageContext: {
        web: {
            absoluteUrl: "http://test.sharepoint.com/sites/dev"
        }
    },
    spHttpClient: {
        get: (url, configVersion) => {
            if (url === "http://test.sharepoint.com/sites/dev/_api/web/lists/getByTitle('Events')/items") {
                return Promise.resolve({
                    json: () => {
                        return Promise.resolve({
                            value: [{
                                Id: 1,
                                Title: "Test 1",
                                Link: "http://test_event_1",
                                Category: "Test"
                            }, {
                                Id: 2,
                                Title: "Test 2",
                                Link: "http://test_event_2",
                                Category: "Test"
                            }, {
                                Id: 3,
                                Title: "Test 3",
                                Link: "http://test_event_3",
                                Category: "Off-Work"
                            }]
                        })
                    }
                });
            }
        }
    }
}
describe("<SPMessageBarComponent />", () => {
    it("Should render loading", ()=>{
        let element = mount(<SPMessageBarComponent context={mockedSPContext as any} />);
        let innerText = element.find("div").text();
        assert.equal(innerText, "Loading...");
    });
    it("Should render first message", () => {
        return new Promise(async (resolve, error) => {
            let element = mount(<SPMessageBarComponent context={mockedSPContext as any} />);
            let innerText = element.find("div").text();
            assert.equal(innerText, "Loading...");

            let instance = element.instance();
            await instance.componentDidMount();

            element.update();
            innerText = element.find(".simple_message").text();
            assert.equal(innerText, "Test 1");
            resolve();
        });
    });
});
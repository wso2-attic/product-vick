/*
 *  Copyright (c) 2018 WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */

package org.wso2.vick.sts.core;

import java.util.List;

/**
 * STS Request object for Vick.
 */
public class VickSTSRequest {

    /**
     * Identifier of the workload initiating the STS request.
     */
    private String source;

    private List<String> scopes;

    private List<String> audiences;

    private String userContextJwt;

    public String getSource() {

        return source;
    }

    public void setSource(String source) {

        this.source = source;
    }

    public List<String> getScopes() {

        return scopes;
    }

    public void setScopes(List<String> scopes) {

        this.scopes = scopes;
    }

    public List<String> getAudiences() {

        return audiences;
    }

    public void setAudiences(List<String> audiences) {

        this.audiences = audiences;
    }

    public String getUserContextJwt() {
        return userContextJwt;
    }

    public void setUserContextJwt(String userContextJwt) {
        this.userContextJwt = userContextJwt;
    }
}

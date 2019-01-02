/*
 * Copyright (c) 2018 WSO2 Inc. (http:www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http:www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package resources

const (
	gatewayServicePort   = 80
	gatewayContainerPort = 8080

	apiConfigKey  = "api-config"
	apiConfigFile = "api.json"

	gatewayConfigKey  = "gateway-config"
	gatewayConfigFile = "gw.json"

	gatewaySetupConfigKey  = "gateway-setup-config"
	gatewaySetupConfigFile = "micro-gw.conf"

	configVolumeName = "config-volume"
	configMountPath  = "/etc/config"

	gatewayBuildVolumeName = "build-volume"
	gatewayBuildMountPath  = "/target"

	setupConfigVolumeName = "setup-config-volume"
	setupConfigMountPath  = "/wso2am-micro-gw-2.6.0/resources/conf"

	// used for tracing
	appLabelKey = "app"
)

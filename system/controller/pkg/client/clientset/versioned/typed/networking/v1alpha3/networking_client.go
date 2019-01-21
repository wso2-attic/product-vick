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

// Code generated by client-gen. DO NOT EDIT.

package v1alpha3

import (
	v1alpha3 "github.com/wso2/product-vick/system/controller/pkg/apis/istio/networking/v1alpha3"
	"github.com/wso2/product-vick/system/controller/pkg/client/clientset/versioned/scheme"
	serializer "k8s.io/apimachinery/pkg/runtime/serializer"
	rest "k8s.io/client-go/rest"
)

type NetworkingV1alpha3Interface interface {
	RESTClient() rest.Interface
	DestinationRulesGetter
	EnvoyFiltersGetter
	GatewaysGetter
	VirtualServicesGetter
}

// NetworkingV1alpha3Client is used to interact with features provided by the networking group.
type NetworkingV1alpha3Client struct {
	restClient rest.Interface
}

func (c *NetworkingV1alpha3Client) DestinationRules(namespace string) DestinationRuleInterface {
	return newDestinationRules(c, namespace)
}

func (c *NetworkingV1alpha3Client) EnvoyFilters(namespace string) EnvoyFilterInterface {
	return newEnvoyFilters(c, namespace)
}

func (c *NetworkingV1alpha3Client) Gateways(namespace string) GatewayInterface {
	return newGateways(c, namespace)
}

func (c *NetworkingV1alpha3Client) VirtualServices(namespace string) VirtualServiceInterface {
	return newVirtualServices(c, namespace)
}

// NewForConfig creates a new NetworkingV1alpha3Client for the given config.
func NewForConfig(c *rest.Config) (*NetworkingV1alpha3Client, error) {
	config := *c
	if err := setConfigDefaults(&config); err != nil {
		return nil, err
	}
	client, err := rest.RESTClientFor(&config)
	if err != nil {
		return nil, err
	}
	return &NetworkingV1alpha3Client{client}, nil
}

// NewForConfigOrDie creates a new NetworkingV1alpha3Client for the given config and
// panics if there is an error in the config.
func NewForConfigOrDie(c *rest.Config) *NetworkingV1alpha3Client {
	client, err := NewForConfig(c)
	if err != nil {
		panic(err)
	}
	return client
}

// New creates a new NetworkingV1alpha3Client for the given RESTClient.
func New(c rest.Interface) *NetworkingV1alpha3Client {
	return &NetworkingV1alpha3Client{c}
}

func setConfigDefaults(config *rest.Config) error {
	gv := v1alpha3.SchemeGroupVersion
	config.GroupVersion = &gv
	config.APIPath = "/apis"
	config.NegotiatedSerializer = serializer.DirectCodecFactory{CodecFactory: scheme.Codecs}

	if config.UserAgent == "" {
		config.UserAgent = rest.DefaultKubernetesUserAgent()
	}

	return nil
}

// RESTClient returns a RESTClient that is used to communicate
// with API server by this client implementation.
func (c *NetworkingV1alpha3Client) RESTClient() rest.Interface {
	if c == nil {
		return nil
	}
	return c.restClient
}

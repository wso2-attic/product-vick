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

import (
	"github.com/wso2/product-vick/system/controller/pkg/apis/vick"
	"github.com/wso2/product-vick/system/controller/pkg/apis/vick/v1alpha1"
	"github.com/wso2/product-vick/system/controller/pkg/controller"
	networkv1 "k8s.io/api/networking/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func CreateNetworkPolicy(cell *v1alpha1.Cell) *networkv1.NetworkPolicy {

	cellName := cell.Name
	gatewayName := GatewayName(cell);
	var serviceNames []string

	servicesSpecs := cell.Spec.Services
	for _, serviceSpec := range servicesSpecs {
		serviceNames = append(serviceNames, ServiceName(cell, serviceSpec))
	}

	return &networkv1.NetworkPolicy{
		ObjectMeta: metav1.ObjectMeta{
			Name:      NetworkPolicyName(cell),
			Namespace: cell.Namespace,
			Labels:    createLabels(cell),
			OwnerReferences: []metav1.OwnerReference{
				*controller.CreateCellOwnerRef(cell),
			},
		},
		Spec: networkv1.NetworkPolicySpec{
			PodSelector: metav1.LabelSelector{
				MatchLabels: map[string]string{
					vick.CellLabelKey: cellName,
				},
				MatchExpressions: []metav1.LabelSelectorRequirement{
					{
						Key:      vick.CellServiceLabelKey,
						Operator: metav1.LabelSelectorOpIn,
						Values:   serviceNames,
					},
				},
			},
			PolicyTypes: []networkv1.PolicyType{
				networkv1.PolicyTypeIngress,
			},
			Ingress: []networkv1.NetworkPolicyIngressRule{
				{
					From: []networkv1.NetworkPolicyPeer{
						{
							PodSelector: &metav1.LabelSelector{
								MatchLabels: map[string]string{
									vick.CellLabelKey:        cellName,
									vick.CellGatewayLabelKey: gatewayName,
								},
							},
						},
						{
							PodSelector: &metav1.LabelSelector{
								MatchLabels: map[string]string{
									vick.CellLabelKey: cellName,
								},
								MatchExpressions: []metav1.LabelSelectorRequirement{
									{
										Key:      vick.CellServiceLabelKey,
										Operator: metav1.LabelSelectorOpIn,
										Values:   serviceNames,
									},
								},
							},
						},
					},
				},
			},
		},
	}
}

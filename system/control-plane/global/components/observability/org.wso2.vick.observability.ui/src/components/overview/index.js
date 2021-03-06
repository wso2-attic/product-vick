/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint max-lines: ["off"] */

import ArrowRightAltSharp from "@material-ui/icons/ArrowRightAltSharp";
import Button from "@material-ui/core/Button";
import CellIcon from "../../icons/CellIcon";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Constants from "../../utils/constants";
import DependencyGraph from "../common/DependencyGraph";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Error from "@material-ui/icons/Error";
import Fade from "@material-ui/core/Fade";
import Grey from "@material-ui/core/colors/grey";
import HttpUtils from "../../utils/api/httpUtils";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreHoriz";
import NotFound from "../common/error/NotFound";
import NotificationUtils from "../../utils/common/notificationUtils";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import QueryUtils from "../../utils/common/queryUtils";
import React from "react";
import SidePanelContent from "./SidePanelContent";
import StateHolder from "../common/state/stateHolder";
import TopToolbar from "../common/toptoolbar";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import withGlobalState from "../common/state";
import {withStyles} from "@material-ui/core/styles";
import withColor, {ColorGenerator} from "../common/color";
import * as PropTypes from "prop-types";

const drawerWidth = 300;

const styles = (theme) => ({
    root: {
        display: "flex"
    },
    moreDetails: {
        position: "absolute",
        right: 25,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    moreDetailsShift: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginTop: 8,
        marginRight: 8
    },
    hide: {
        display: "none"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        top: 135,
        width: drawerWidth,
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: Grey[200]
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: 5,
        justifyContent: "flex-start",
        textTransform: "uppercase",
        minHeight: "fit-content"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: Number(theme.spacing.unit),
        marginRight: -drawerWidth + theme.spacing.unit
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginRight: theme.spacing.unit
    },
    sideBarHeading: {
        letterSpacing: 1,
        fontSize: 12,
        marginLeft: 4
    },
    btnLegend: {
        float: "right",
        position: "sticky",
        bottom: 20,
        marginTop: 10,
        fontSize: 12
    },
    legendContent: {
        padding: theme.spacing.unit * 2
    },
    legendText: {
        display: "inline-flex",
        marginLeft: 5,
        fontSize: 12
    },
    legendIcon: {
        verticalAlign: "middle",
        marginLeft: 20
    },
    legendFirstEl: {
        verticalAlign: "middle"
    }
});

class Overview extends React.Component {

    constructor(props) {
        super(props);

        this.defaultState = {
            summary: {
                topic: "VICK Deployment",
                content: [
                    {
                        key: "Total",
                        value: 0
                    },
                    {
                        key: "Successful",
                        value: 0
                    },
                    {
                        key: "Failed",
                        value: 0
                    },
                    {
                        key: "Warning",
                        value: 0
                    }
                ]
            },
            request: {
                statusCodes: [
                    {
                        key: "Total",
                        value: 0
                    },
                    {
                        key: "OK",
                        value: 0
                    },
                    {
                        key: "3xx",
                        value: 0
                    },
                    {
                        key: "4xx",
                        value: 0
                    },
                    {
                        key: "5xx",
                        value: 0
                    },
                    {
                        key: "Unknown",
                        value: 0
                    }
                ],
                cellStats: []
            },
            healthInfo: [],
            selectedCell: null,
            data: {
                nodes: null,
                links: null
            },
            error: null,
            open: true,
            legend: null,
            legendOpen: false,
            listData: [],
            page: 0,
            rowsPerPage: 5
        };

        const queryParams = HttpUtils.parseQueryParams(props.location.search);
        this.state = {
            ...JSON.parse(JSON.stringify(this.defaultState)),
            selectedCell: queryParams.cell ? queryParams.cell : null,
            isLoading: true
        };
    }

    viewGenerator = (nodeProps) => {
        const {colorGenerator} = this.props;
        const {selectedCell} = this.state;
        const nodeId = nodeProps.id;
        const color = colorGenerator.getColor(nodeId);
        const outlineColor = ColorGenerator.shadeColor(color, -0.08);
        const state = this.getCellState(nodeId);

        const style = {};
        style.transform = "translate(2%, 15%) scale(2, 2)";
        const cellIcon
            = <polygon strokeWidth="4" fill={color} stroke={(selectedCell === nodeId) ? "#444" : outlineColor}
                points="34.2,87.4 12.3,65.5 12.3,34.5 34.2,12.6 65.2,12.6 87.1,34.5 87.1,65.5 65.2,87.4"
                style={style} strokeLinejoin="round"/>;

        let cellView;
        if (state === Constants.Status.Success) {
            cellView = (
                <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 240 240">
                    {cellIcon}
                </svg>
            );
        } else if (state === Constants.Status.Warning) {
            cellView = (
                <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 240 240">
                    <g>
                        <g>
                            {cellIcon}
                        </g>
                    </g>
                    <g>
                        <path stroke="#fff" strokeWidth="3" fill={colorGenerator.getColor(ColorGenerator.WARNING)}
                            d="M146.5,6.1c-23.6,0-42.9,19.3-42.9,42.9s19.3,42.9,42.9,42.9s42.9-19.3,42.9-42.9S170.1,
                               6.1,146.5,6.1z" />
                        <path fill="#ffffff" d="M144.6,56.9h7.9v7.9h-7.9V56.9z M144.6,25.2h7.9V49h-7.9V25.2z"/>
                    </g>
                </svg>
            );
        } else {
            cellView = (
                <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 240 240">
                    <g>
                        <g>
                            {cellIcon}
                        </g>
                    </g>
                    <g>
                        <path stroke="#fff" strokeWidth="3" fill={colorGenerator.getColor(ColorGenerator.ERROR)}
                            d="M146.5,6.1c-23.6,0-42.9,19.3-42.9,42.9s19.3,42.9,42.9,42.9s42.9-19.3,42.9-42.9S170.1,
                               6.1, 146.5,6.1z"/>
                        <path fill="#ffffff" d="M144.6,56.9h7.9v7.9h-7.9V56.9z M144.6,25.2h7.9V49h-7.9V25.2z"/>
                    </g>
                </svg>
            );
        }
        return cellView;
    };

    getCellState = (nodeId) => {
        const healthInfo = this.defaultState.healthInfo.find((element) => element.nodeId === nodeId);
        return healthInfo.status;
    };

    onClickCell = (nodeId, isUserAction) => {
        const {globalState, history, match, location} = this.props;
        const fromTime = QueryUtils.parseTime(globalState.get(StateHolder.GLOBAL_FILTER).startTime);
        const toTime = QueryUtils.parseTime(globalState.get(StateHolder.GLOBAL_FILTER).endTime);

        // Updating the Browser URL
        const queryParamsString = HttpUtils.generateQueryParamString({
            ...HttpUtils.parseQueryParams(location.search),
            cell: nodeId
        });
        history.replace(match.url + queryParamsString, {
            ...location.state
        });

        const search = {
            queryStartTime: fromTime.valueOf(),
            queryEndTime: toTime.valueOf(),
            timeGranularity: QueryUtils.getTimeGranularity(fromTime, toTime)
        };
        if (isUserAction) {
            NotificationUtils.showLoadingOverlay(`Loading ${nodeId} Cell Information`, globalState);
        }
        HttpUtils.callObservabilityAPI(
            {
                url: `/http-requests/cells/${nodeId}/microservices${HttpUtils.generateQueryParamString(search)}`,
                method: "GET"
            },
            this.props.globalState
        ).then((response) => {
            const cell = this.state.data.nodes.find((element) => element.id === nodeId);
            const serviceHealth = this.getServiceHealth(cell.services, response);
            const serviceHealthCount = this.getHealthCount(serviceHealth);
            const statusCodeContent = this.getStatusCodeContent(nodeId, this.defaultState.request.cellStats);
            const serviceInfo = this.loadServicesInfo(cell.services, serviceHealth);
            this.setState((prevState) => ({
                summary: {
                    ...prevState.summary,
                    topic: nodeId,
                    content: [
                        {
                            key: "Total",
                            value: serviceInfo.length
                        },
                        {
                            key: "Successful",
                            value: serviceHealthCount.success
                        },
                        {
                            key: "Failed",
                            value: serviceHealthCount.error
                        },
                        {
                            key: "Warning",
                            value: serviceHealthCount.warning
                        }
                    ]
                },
                data: {...prevState.data},
                listData: serviceInfo,
                selectedCell: cell.id,
                request: {
                    ...prevState.request,
                    statusCodes: statusCodeContent
                }
            }));
            if (isUserAction) {
                NotificationUtils.hideLoadingOverlay(globalState);
            }
        }).catch((error) => {
            this.setState({error: error});
            if (isUserAction) {
                NotificationUtils.hideLoadingOverlay(globalState);
                NotificationUtils.showNotification(
                    `Failed to load ${nodeId} Cell Dependencies`,
                    NotificationUtils.Levels.ERROR,
                    globalState
                );
            }
        });
    };

    getServiceHealth = (services, responseCodeStats) => {
        const {globalState} = this.props;
        const config = globalState.get(StateHolder.CONFIG);
        const healthInfo = [];
        services.forEach((service) => {
            const total = this.getTotalServiceRequests(service, responseCodeStats, "*");
            if (total === 0) {
                healthInfo.push({nodeId: service, status: Constants.Status.Success, percentage: 1});
            } else {
                const error = this.getTotalServiceRequests(service, responseCodeStats, "5xx");
                const successPercentage = 1 - (error / total);

                if (successPercentage > config.percentageRangeMinValue.warningThreshold) {
                    healthInfo.push({nodeId: service, status: Constants.Status.Success, percentage: successPercentage});
                } else if (successPercentage > config.percentageRangeMinValue.errorThreshold) {
                    healthInfo.push({nodeId: service, status: Constants.Status.Warning, percentage: successPercentage});
                } else {
                    healthInfo.push({nodeId: service, status: Constants.Status.Error, percentage: successPercentage});
                }
            }
        });
        return healthInfo;
    };

    onClickGraph = () => {
        const {history, match, location} = this.props;

        // Updating the Browser URL
        const queryParamsString = HttpUtils.generateQueryParamString({
            ...HttpUtils.parseQueryParams(location.search),
            cell: undefined
        });
        history.replace(match.url + queryParamsString, {
            ...location.state
        });

        const defaultState = JSON.parse(JSON.stringify(this.defaultState));
        this.setState((prevState) => ({
            ...prevState,
            summary: defaultState.summary,
            listData: this.loadCellInfo(defaultState.data.nodes),
            selectedCell: null,
            request: defaultState.request
        }));
    };

    handleDrawerOpen = () => {
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    loadCellInfo = (nodes) => {
        const nodeInfo = [];
        nodes.forEach((node) => {
            const healthInfo = this.defaultState.healthInfo.find((element) => element.nodeId === node.id);
            nodeInfo.push([healthInfo.percentage, node.id, node.id]);
        });
        return nodeInfo;
    };

    loadServicesInfo = (services, healthInfo) => {
        const serviceInfo = [];
        services.forEach((service) => {
            const healthElement = healthInfo.find((element) => element.nodeId === service);
            serviceInfo.push([healthElement.percentage, service, service]);
        });
        return serviceInfo;
    };

    callOverviewInfo = (isUserAction, fromTime, toTime) => {
        const {colorGenerator, globalState} = this.props;
        const {selectedCell} = this.state;
        const self = this;

        const search = {};
        if (fromTime && toTime) {
            search.fromTime = fromTime.valueOf();
            search.toTime = toTime.valueOf();
        }
        if (isUserAction) {
            NotificationUtils.showLoadingOverlay("Loading Cell Dependencies", globalState);
        }
        HttpUtils.callObservabilityAPI(
            {
                url: `/dependency-model/cells${HttpUtils.generateQueryParamString(search)}`,
                method: "GET"
            },
            globalState
        ).then((result) => {
            const {nodes, edges} = result;

            self.defaultState.healthInfo = self.getCellHealth(nodes);
            const healthCount = self.getHealthCount(self.defaultState.healthInfo);
            const summaryContent = [
                {
                    key: "Total",
                    value: nodes.length
                },
                {
                    key: "Successful",
                    value: healthCount.success
                },
                {
                    key: "Failed",
                    value: healthCount.error
                },
                {
                    key: "Warning",
                    value: healthCount.warning
                }
            ];
            self.defaultState.summary.content = summaryContent;
            self.defaultState.data.nodes = nodes;
            self.defaultState.data.links = edges;
            colorGenerator.addKeys(nodes);
            const cellList = self.loadCellInfo(nodes);
            self.setState((prevState) => ({
                data: {
                    nodes: nodes,
                    links: edges
                },
                summary: {
                    ...prevState.summary,
                    content: summaryContent
                },
                listData: cellList,
                isLoading: false // From this point onwards the underlying content is always shown in the overlay
            }));
            if (isUserAction) {
                NotificationUtils.hideLoadingOverlay(globalState);
            }
            if (selectedCell) {
                self.onClickCell(selectedCell, isUserAction);
            }
        }).catch((error) => {
            self.setState({error: error});
            if (isUserAction) {
                NotificationUtils.hideLoadingOverlay(globalState);
                NotificationUtils.showNotification(
                    "Failed to load Cell Dependencies",
                    NotificationUtils.Levels.ERROR,
                    globalState
                );
            }
        });
    };

    getHealthCount = (healthInfo) => {
        let successCount = 0;
        let warningCount = 0;
        let errorCount = 0;
        healthInfo.forEach((info) => {
            if (info.status === Constants.Status.Success) {
                successCount += 1;
            } else if (info.status === Constants.Status.Warning) {
                warningCount += 1;
            } else {
                errorCount += 1;
            }
        });
        return {success: successCount, warning: warningCount, error: errorCount};
    };

    getCellHealth = (nodes) => {
        const {globalState} = this.props;
        const config = globalState.get(StateHolder.CONFIG);
        const healthInfo = [];
        nodes.forEach((node) => {
            const total = this.getTotalRequests(node.id, this.defaultState.request.cellStats, "*");
            if (total === 0) {
                healthInfo.push({nodeId: node.id, status: Constants.Status.Success, percentage: 1});
            } else {
                const error = this.getTotalRequests(node.id, this.defaultState.request.cellStats, "5xx");
                const successPercentage = 1 - (error / total);
                if (successPercentage > config.percentageRangeMinValue.warningThreshold) {
                    healthInfo.push({nodeId: node.id, status: Constants.Status.Success, percentage: successPercentage});
                } else if (successPercentage > config.percentageRangeMinValue.errorThreshold) {
                    healthInfo.push({nodeId: node.id, status: Constants.Status.Warning, percentage: successPercentage});
                } else {
                    healthInfo.push({nodeId: node.id, status: Constants.Status.Error, percentage: successPercentage});
                }
            }
        });
        return healthInfo;
    };

    loadOverviewOnTimeUpdate = (isUserAction, fromTime, toTime) => {
        const {globalState} = this.props;
        const search = {
            queryStartTime: fromTime.valueOf(),
            queryEndTime: toTime.valueOf(),
            timeGranularity: QueryUtils.getTimeGranularity(fromTime, toTime)
        };
        if (isUserAction) {
            NotificationUtils.showLoadingOverlay("Loading Cell Metadata", globalState);
        }
        HttpUtils.callObservabilityAPI(
            {
                url: `/http-requests/cells${HttpUtils.generateQueryParamString(search)}`,
                method: "GET"
            },
            this.props.globalState
        ).then((response) => {
            const statusCodeContent = this.getStatusCodeContent(null, response);
            this.defaultState.request.statusCodes = statusCodeContent;
            this.defaultState.request.cellStats = response;
            this.setState((prevState) => ({
                stats: {
                    cellStats: response
                },
                request: {
                    ...prevState.request,
                    statusCodes: statusCodeContent
                }
            }));
            if (isUserAction) {
                NotificationUtils.hideLoadingOverlay(globalState);
            }
            this.callOverviewInfo(isUserAction, fromTime, toTime);
        }).catch((error) => {
            this.setState({error: error});
            if (isUserAction) {
                NotificationUtils.hideLoadingOverlay(globalState);
                NotificationUtils.showNotification(
                    "Failed to load Cell Metadata",
                    NotificationUtils.Levels.ERROR,
                    globalState
                );
            }
        });
    };

    getStatusCodeContent = (cell, data) => {
        const total = this.getTotalRequests(cell, data, "*");
        const response2xx = this.getTotalRequests(cell, data, "2xx");
        const response3xx = this.getTotalRequests(cell, data, "3xx");
        const response4xx = this.getTotalRequests(cell, data, "4xx");
        const response5xx = this.getTotalRequests(cell, data, "5xx");
        const responseUnknown = total - (response2xx + response3xx + response4xx + response5xx);
        return [
            {
                key: "Total",
                value: total
            },
            {
                key: "OK",
                count: response2xx,
                value: this.getPercentage(response2xx, total)
            },
            {
                key: "3xx",
                count: response3xx,
                value: this.getPercentage(response3xx, total)
            },
            {
                key: "4xx",
                count: response4xx,
                value: this.getPercentage(response4xx, total)
            },
            {
                key: "5xx",
                count: response5xx,
                value: this.getPercentage(response5xx, total)
            },
            {
                key: "Unknown",
                count: responseUnknown,
                value: this.getPercentage(responseUnknown, total)
            }
        ];
    };

    getPercentage = (responseCode, total) => {
        if (total !== 0) {
            return Math.round((responseCode / total) * 100);
        }
        return 0;
    };

    getTotalRequests = (cell, stats, responseCode) => {
        let total = 0;
        stats.forEach((stat) => {
            if (stat[1] !== "") {
                if (!cell || cell === stat[1]) {
                    if (responseCode === "*") {
                        total += stat[4];
                    } else if (responseCode === stat[2]) {
                        total += stat[4];
                    }
                }
            }
        });
        return total;
    };

    getTotalServiceRequests = (cell, stats, responseCode) => {
        let total = 0;
        stats.forEach((stat) => {
            if (stat[2] !== "") {
                if (!cell || cell === stat[2]) {
                    if (responseCode === "*") {
                        total += stat[6];
                    } else if (responseCode === stat[4]) {
                        total += stat[6];
                    }
                }
            }
        });
        return total;
    };

    handleClick = (event) => {
        const {currentTarget} = event;
        this.setState((state) => ({
            legend: currentTarget,
            legendOpen: !state.legendOpen
        }));
    };

    render = () => {
        const {classes, theme, colorGenerator} = this.props;
        const {open, selectedCell, legend, legendOpen, isLoading} = this.state;

        const id = legendOpen ? "legend-popper" : null;
        const percentageVal = this.props.globalState.get(StateHolder.CONFIG).percentageRangeMinValue;
        const isDataAvailable = this.state.data.nodes && this.state.data.nodes.length > 0;

        return (
            <React.Fragment>
                <TopToolbar title={"Overview"} onUpdate={this.loadOverviewOnTimeUpdate}/>
                {
                    isLoading
                        ? null
                        : (
                            <div className={classes.root}>
                                <Paper className={classNames(classes.content, {
                                    [classes.contentShift]: open
                                })}>
                                    {
                                        isDataAvailable
                                            ? (
                                                <React.Fragment>
                                                    <DependencyGraph id="graph-id" data={this.state.data}
                                                        onClickNode={(nodeId) => this.onClickCell(nodeId, true)}
                                                        onClickGraph={this.onClickGraph}
                                                        config={{
                                                            node: {
                                                                viewGenerator: this.viewGenerator
                                                            }
                                                        }}/>
                                                    <Button aria-describedby={id} variant="outlined"
                                                        className={classes.btnLegend} onClick={this.handleClick}>
                                                        Legend
                                                    </Button>
                                                </React.Fragment>
                                            )
                                            : (
                                                <NotFound title={"No Cells Found"}
                                                    description={"No Requests were sent within the selected time range"}
                                                />
                                            )
                                    }
                                    <Popper id={id} open={legendOpen} anchorEl={legend} placement="top-end" transition>
                                        {({TransitionProps}) => (
                                            <Fade {...TransitionProps} timeout={350}>
                                                <Paper>
                                                    <div className={classes.legendContent}>
                                                        <CellIcon className={classes.legendFirstEl} color="action"
                                                            fontSize="small"/>
                                                        <Typography color="inherit"
                                                            className={classes.legendText}> Cell</Typography>
                                                        <ArrowRightAltSharp className={classes.legendIcon}
                                                            color="action"/>
                                                        <Typography color="inherit"
                                                            className={classes.legendText}> Dependency</Typography>
                                                        <Error className={classes.legendIcon}
                                                            style={{
                                                                color: colorGenerator.getColor(ColorGenerator.WARNING)
                                                            }}/>
                                                        <Typography color="inherit" className={classes.legendText}>
                                                            {Math.round((1 - percentageVal.warningThreshold) * 100)}%
                                                            - {Math.round((1 - percentageVal.errorThreshold) * 100)}%
                                                            Error </Typography>
                                                        <Error className={classes.legendIcon} color="error"/>
                                                        <Typography color="inherit" className={classes.legendText}>
                                                            &gt;
                                                            {Math.round((1 - percentageVal.errorThreshold) * 100)}%
                                                            Error
                                                        </Typography>
                                                    </div>
                                                </Paper>
                                            </Fade>
                                        )}
                                    </Popper>
                                </Paper>
                                {
                                    isDataAvailable
                                        ? (
                                            <React.Fragment>
                                                <div className={classNames(classes.moreDetails, {
                                                    [classes.moreDetailsShift]: open
                                                })}>
                                                    <IconButton color="inherit" aria-label="Open drawer"
                                                        onClick={this.handleDrawerOpen}
                                                        className={classNames(classes.menuButton, open && classes.hide)}
                                                    >
                                                        <MoreIcon/>
                                                    </IconButton>
                                                </div>

                                                <Drawer className={classes.drawer} variant="persistent" anchor="right"
                                                    open={open}
                                                    classes={{
                                                        paper: classes.drawerPaper
                                                    }}>
                                                    <div className={classes.drawerHeader}>
                                                        <IconButton onClick={this.handleDrawerClose}>
                                                            {
                                                                theme.direction === "rtl"
                                                                    ? <ChevronLeftIcon/>
                                                                    : <ChevronRightIcon/>
                                                            }
                                                        </IconButton>
                                                        <Typography color="textSecondary"
                                                            className={classes.sideBarHeading}>
                                                            {selectedCell ? "Cell Details" : "Overview"}
                                                        </Typography>
                                                    </div>
                                                    <Divider/>
                                                    <SidePanelContent summary={this.state.summary}
                                                        request={this.state.request} selectedCell={selectedCell}
                                                        open={this.state.open} listData={this.state.listData}/>
                                                </Drawer>
                                            </React.Fragment>

                                        )
                                        : null
                                }
                            </div>
                        )
                }
            </React.Fragment>
        );
    };

}

Overview.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    history: PropTypes.shape({
        replace: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.shape({
        search: PropTypes.string.isRequired
    }).isRequired,
    match: PropTypes.shape({
        url: PropTypes.string.isRequired
    }).isRequired,
    globalState: PropTypes.instanceOf(StateHolder).isRequired,
    colorGenerator: PropTypes.instanceOf(ColorGenerator)
};

export default withStyles(styles, {withTheme: true})(withGlobalState(withColor(Overview)));

import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRouteMatch, useParams, useHistory } from 'react-router';
import IndexStore from '../../index.store';
import Tippy from '@tippyjs/react';
import { copyToClipboard } from '../../../../common';
import { ReactComponent as DropDown } from '../../../../../assets/icons/ic-dropdown-filled.svg';
import { ReactComponent as Clipboard } from '../../../../../assets/icons/ic-copy.svg';
import PodHeaderComponent from './PodHeader.component';
import { NodeType, Node, iNode } from '../../appDetails.type';
import './nodeType.scss'
import { getNodeDetailTabs } from '../nodeDetail/nodeDetail.util';
import Menu from './DeleteRowPopUp.component';
import AppDetailsStore from '../../appDetails.store';
import { toast } from 'react-toastify';

function NodeComponent() {
    const { path, url } = useRouteMatch();
    const history = useHistory()
    const [selectedNodes, setSelectedNodes] = useState<Array<iNode>>()
    const [selectedHealthyNodeCount, setSelectedHealthyNodeCount] = useState<Number>(0)
    const [copied, setCopied] = useState(false);
    const [tableHeader, setTableHeader] = useState([]);
    const [firstColWidth, setFirstColWidth] = useState("col-12");
    const [podType, setPodType] = useState(false)
    const [detailedNode, setDetailedNode] = useState<{ name: string; containerName?: string }>(null);
    const appDetails = IndexStore.getAppDetails()
    // const [nodes] = useSharedState(IndexStore.getAppDetailsNodes(), IndexStore.getAppDetailsNodesObservable())
    const params = useParams<{ nodeType: NodeType }>()
    // const [tabs, setTabs] = useState([])

    useEffect(() => {
        if (!copied) return
        setTimeout(() => setCopied(false), 2000)
    }, [copied])

    useEffect(() => {

        if (params.nodeType) {
            // const _tabs = getNodeDetailTabs(params.nodeType as NodeType)
            // setTabs(_tabs)

            let tableHeader: Array<String>, _fcw: string;

            switch (params.nodeType) {
                case NodeType.Pod.toLowerCase():
                    tableHeader = ["Pod (All)", "Ready"]
                    _fcw = "col-8 pl-16"
                    break;
                case NodeType.Service.toLowerCase():
                    tableHeader = ["Name", "URL"]
                    _fcw = "col-6 pl-16"
                    break;
                default:
                    tableHeader = ["Name"]
                    _fcw = "col-12 pl-16"
                    break;
            }

            setTableHeader(tableHeader)
            setFirstColWidth(_fcw)

            let _selectedNodes = IndexStore.getiNodesByKind(params.nodeType);//.filter((pn) => pn.kind.toLowerCase() === params.nodeType.toLowerCase())

            if (params.nodeType.toLowerCase() === NodeType.Pod.toLowerCase()) {
                _selectedNodes = _selectedNodes.filter((node) => {
                    const _podMetaData = IndexStore.getMetaDataForPod(node.name)

                    return _podMetaData.isNew === podType

                })
            }
            let _healthyNodeCount = 0

            _selectedNodes.forEach((node: Node) => {
                if (node.health?.status.toLowerCase() === "healthy") {
                    _healthyNodeCount++
                }
            })

            setSelectedNodes([..._selectedNodes])

            setSelectedHealthyNodeCount(_healthyNodeCount)
        }
    }, [params.nodeType, podType])

    const markNodeSelected = (nodes: Array<iNode>, nodeName: string) => {
        const updatedNodes = nodes.map(node => {
            if (node.name === nodeName) {
                node.isSelected = !node.isSelected
            } else if (node.childNodes?.length > 0) {
                markNodeSelected(node.childNodes, nodeName)
            }

            return node
        })

        return updatedNodes
    }

    const describeNode = (name: string, containerName: string) => {
        setDetailedNode({ name, containerName });
    }

    const handleActionTabClick = (node: iNode, _tabName: string) => {
        const _url = `${url.split("/").slice(0, -1).join("/")}/${node.kind.toLowerCase()}/${node.name}/${_tabName.toLowerCase()}`
        const isAdded = AppDetailsStore.addAppDetailsTab(node.kind, node.name, _url)
        if (isAdded) {
            history.push(_url)
        } else {
            toast.error(<div>
                <div>Max 5 tabs allowed</div>
                <p>Please close an open tab and try again.</p>
            </div>)
        }
    }

    const makeNodeTree = (nodes: Array<iNode>, showHeader?: boolean) => {
        return nodes.map((node, index) => {
            return (
                <React.Fragment key={'grt' + index}>
                    {showHeader && <div className="fw-6 pt-10 pb-10 pl-16 border-bottom">
                        <span >{node.kind}</span>
                    </div>}
                    <div className="resource-row m-0 flex flex-justify" style={{width: '100vw'}} onClick={() => {
                        setSelectedNodes(markNodeSelected(selectedNodes, node.name))
                    }} >
                        <div className={`resource-row__content ${firstColWidth} pt-9 pb-9 cursor`} >
                            <div className="flex left top">
                                {(node.childNodes?.length > 0) ? <DropDown
                                    className={`rotate icon-dim-24 pointer ${node.isSelected ? 'fcn-9' : 'fcn-5'} `}
                                    style={{ ['--rotateBy' as any]: !node.isSelected ? '-90deg' : '0deg' }}
                                /> : <span className="pl-12 pr-12"></span>}
                                <div>
                                    <div>{node.name}</div>
                                    <div className="cg-5">{node.health?.status}</div>
                                </div>

                                <div>
                                    <Tippy
                                        className="default-tt"
                                        arrow={false}
                                        placement="bottom"
                                        content={copied ? 'Copied!' : 'Copy to clipboard.'}
                                        trigger='mouseenter click'
                                    >
                                        <Clipboard
                                            className="resource-action-tabs__active icon-dim-12 pointer ml-8 mr-8"
                                            onClick={(e) => copyToClipboard(node?.name, () => setCopied(true))}
                                        />
                                    </Tippy>
                                    {getNodeDetailTabs(node.kind).map((tab, index) => {
                                        return <a key={"tab__" + index} onClick={() => handleActionTabClick(node, tab)} className="fw-6 cb-5 ml-6 cursor resource-action-tabs__active">
                                            {tab}
                                        </a>
                                    })}
                                </div>

                            </div>
                        </div>


                        {(params.nodeType === NodeType.Service.toLowerCase()) && <div className={"col-6 pt-9 pb-9 flex left"} >
                            {node.name + "." + node.namespace}  : portnumber
                            <Tippy
                                className="default-tt"
                                arrow={false}
                                placement="bottom"
                                content={copied ? 'Copied!' : 'Copy to clipboard.'}
                                trigger='mouseenter click'
                            >
                                <Clipboard
                                    className="resource-action-tabs__active pl-4 icon-dim-16 pointer"
                                    onClick={(e) => copyToClipboard(node?.name, () => setCopied(true))}
                                />
                            </Tippy>
                        </div>}

                        {params.nodeType === NodeType.Pod.toLowerCase() &&
                            <React.Fragment>
                                <div className={"col-1 pt-9 pb-9"} > 1/1 </div>
                            </React.Fragment>
                        }

                        <div className="">
                            <Menu nodeDetails={appDetails.resourceTree.nodes}
                                describeNode={describeNode}
                                appName={appDetails.appName}
                                environmentName={appDetails.environmentName}
                                // key={column}
                                appId={appDetails.appId}
                            />
                        </div>


                    </div>

                    {(node.childNodes?.length > 0 && node.isSelected) ?
                        <div className="ml-24 indent-line">
                            <div>{makeNodeTree(node.childNodes, true)}</div>
                        </div>
                        :
                        <React.Fragment>
                            {node.kind === NodeType.Pod && <div className="col-12 pl-16 pt-9 pb-9 ">
                                <div className="fw-6 pt-10 pb-10 pl-32 border-bottom">Containers</div>
                                <div className="resource-row__content pl-32 pt-9 pb-9 cursor">{IndexStore.getMetaDataForPod(node.name).name}</div>
                            </div>}
                        </React.Fragment>
                    }

                </React.Fragment>
            )
        })
    }

    return (
        <div className="container-fluid generic-table ml-0 mr-0" style={{ paddingRight: 0, paddingLeft: 0 }}>
            {(params.nodeType === NodeType.Pod.toLowerCase()) ? <PodHeaderComponent callBack={setPodType} /> :
                <div className="border-bottom  pt-10 pb-10" >
                    <div className="pl-16 fw-6 fs-14 text-capitalize">
                        <span className="pr-4">{selectedNodes && selectedNodes[0]?.kind}</span>
                        <span>({selectedNodes?.length})</span>
                    </div>
                    <div className="pl-16"> {selectedHealthyNodeCount} healthy</div>
                </div>}

            <div className="row border-bottom fw-6 m-0">
                {
                    tableHeader.map((cell, index) => {
                        return <div key={'gpt_' + index} className={(`${index === 0 ? firstColWidth : 'col-1'} pt-9 pb-9`)}>{cell}</div>
                    })
                }
            </div>

            {
                selectedNodes && makeNodeTree(selectedNodes)
            }
        </div>
    )
}

export default NodeComponent

import { BehaviorSubject } from 'rxjs';
import { ApplicationObject } from "./appDetails.type";
import { URLS } from "../../../config";

let applicationObjectTabs: Array<ApplicationObject> = [];
let applicationObjectTabsSubject: BehaviorSubject<Array<ApplicationObject>> = new BehaviorSubject(applicationObjectTabs);

const addAOT = (tabName: string, tabUrl: string, isSelected: boolean, title?: string) => {
    let tab = {} as ApplicationObject
    tab.name = tabName
    tab.url = tabUrl
    tab.isSelected = isSelected
    tab.title = title || tabName
    applicationObjectTabs.push(tab)
}

export const AppDetailsTabs = {
    k8s_Resources: "K8s Resources",
    log_analyzer: "Log Analyzer"
}

const AppDetailsStore = {

    getAppDetailsTabs: () => {
        return applicationObjectTabsSubject.getValue()
    },
    getAppDetailsTabsObservable: () => {
        return applicationObjectTabsSubject.asObservable()
    },
    initAppDetailsTabs: (_url: string, displayLogAnalyzer) => {
        applicationObjectTabs = []

        addAOT(AppDetailsTabs.k8s_Resources, _url + "/" + URLS.APP_DETAILS_K8, true)
        if (displayLogAnalyzer) {
            addAOT(AppDetailsTabs.log_analyzer, _url + "/" + URLS.APP_DETAILS_LOG, false)
        }

        applicationObjectTabsSubject.next([...applicationObjectTabs])
    },
    addAppDetailsTab: (tabKind: string, tabName: string, tabURL: string) => {

        if (!tabName || !tabURL || !tabKind) return

        if (applicationObjectTabs.length === 7) {
            //maximum tab allowed on resource tree node
            return false
        }

        let alredyAdded = false
        let title = tabKind + '/' + tabName
        tabName = tabKind + '/...' + tabName.slice(-6)

        for (let index = 0; index < applicationObjectTabs.length; index++) {
            const tab = applicationObjectTabs[index];
            tab.isSelected = false
            if (tab.name.toLowerCase() === tabName.toLowerCase()) {
                tab.isSelected = true
                alredyAdded = true
            }
        }

        if (!alredyAdded) {
            addAOT(tabName, tabURL, true, title)
        }

        applicationObjectTabsSubject.next([...applicationObjectTabs])

        return true;
    },
    removeAppDetailsTab: (tabName: string) => {
        let _applicationObjectTabs = []

        for (let index = 0; index < applicationObjectTabs.length; index++) {
            const tab = applicationObjectTabs[index];
            tab.isSelected = index === 0
            if (tab.name.toLowerCase() !== tabName.toLowerCase()) {
                _applicationObjectTabs.push(tab)
            }
        }

        applicationObjectTabs = _applicationObjectTabs

        applicationObjectTabsSubject.next([...applicationObjectTabs])
    },
    markAppDetailsTabActive: (tabName: string, url?: string) => {
        for (let index = 0; index < applicationObjectTabs.length; index++) {
            const tab = applicationObjectTabs[index];
            tab.isSelected = false
            if (tab.name.toLowerCase() === tabName.toLowerCase()) {
                tab.isSelected = true
            } else if (tab.url.indexOf(url) !== -1) {
                tab.isSelected = true
            }
        }

        // let title = tabKind + '/' + tabName
        // tabName = tabKind + '/...' + tabName.slice(-6)

        applicationObjectTabsSubject.next([...applicationObjectTabs])
    },

}

export default AppDetailsStore;
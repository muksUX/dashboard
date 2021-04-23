export function getExternalList(): Promise<{
    appname: string;
    environment: string;
    lastupdate: string;
}[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([{
                appname: "shivani",
                environment: "dashboard",
                lastupdate: "19 June 2019,04:02 PM",
            },
            {
                appname: "testing",
                environment: "dashboard",
                lastupdate: "19 June 2019,04:02 PM",
            },
            {
                appname: "demo",
                environment: "dashboard",
                lastupdate: "19 June 2019,04:02 PM",
            },
            {
                appname: "devtron",
                environment: "dashboard",
                lastupdate: "19 June 2019,04:02 PM",
            },
            {
                appname: "shivani@devtron.ai",
                environment: "dashboard",
                lastupdate: "19 June 2019,04:02 PM",
            },
            {
                appname: "shivani@devtron.a",
                environment: "dashboard",
                lastupdate: "19 June 2019,04:02 PM",
            },
            ])
        }, 1000)
    })
}

export function getExternalSearchQueryList(): Promise<{
    appname: string;
    environment: string;
    queryMatch: string;
}[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([{
                appname: "shivani",
                environment: "default_cluster/devtroncd ",
                queryMatch: "19 June 2019,04:02 PM",
            },
            {
                appname: "testing",
                environment: "default_cluster/devtroncd ",
                queryMatch: "19 June 2019,04:02 PM",
            },
            {
                appname: "demo",
                environment: "default_cluster/devtroncddefaultdefault_cluster/devtroncddefault",
                queryMatch: "Gerena is a municipality in the Province of Seville, Spain. It is 25 km northwest of the provincial capital, Seville, and 10 km north of Olivares. Gerena is a municipality in the Province of Seville, Spain. It is 25 km northwest of the provincial capital, Seville, and 10 km north of Olivares",
            },
            {
                appname: "devtron",
                environment: "default_cluster/devtroncd ",
                queryMatch: "19 June 2019,04:02 PM",
            },
            ])
        }, 1000)
    })
}

export function getNamespaceList(): Promise<{
    key: string | number;
    label: string;
    isChecked: boolean;
    isSaved: boolean;   
}[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([{
                key: 1,
                label: "dashboard",
                isChecked: true,
                isSaved: true,
            },
            {
                key: 2,
                label: "demo",
                isChecked: true,
                isSaved: true,
            },
            ])
        }, 1000)
    })
}

export function getClusterList(): Promise<{
    key: string | number;
    label: string;
    isChecked: boolean;
    isSaved: boolean;
}[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([{
                key: 101,
                label: "devtron",
                isChecked: true,
                isSaved: true,
            },
            {
                key: 102,
                label: "dev-1",
                isChecked: true,
                isSaved: true,
            },
            {
                key: 103,
                label: "dev-3",
                isChecked: true,
                isSaved: true,
            },
            ])
        }, 1000)
    })
}
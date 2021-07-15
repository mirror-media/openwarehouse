// import customedItemHeaderActions from './customedItemHeaderActions';
import React, { Suspense } from 'react'
import K5Logo from './components/K5Logo/K5Logo'
import {
    ItemId,
    AddNewItem,
    CreateItem,
} from '@keystonejs/app-admin-ui/components'
import PreviewBtn from './components/PreviewBtn/PreviewBtn'
import './style/hooks.style.css'

import Search from './components/Search/Search'
import ActiveFilters from './components/Filters/ActiveFilters'

import { useList } from '@keystonejs/app-admin-ui/client/providers/List'
import { useListUrlState } from '@keystonejs/app-admin-ui/client/pages/List/dataHooks'
import { LoadingIndicator } from '@arch-ui/loading'
import { captureSuspensePromises } from '@keystonejs/utils'

export default {
    // custom landing page logo
    logo: () => <K5Logo />,
    itemHeaderActions: () => {
        return (
            <div className="item-header-actions">
                <ItemId />
                <PreviewBtn />
                <AddNewItem />
            </div>
        )
    },
    listHeaderActions: () => {
        const { list } = useList()
        const Render = ({ children }) => children()
        const {
            urlState: { currentPage, fields, pageSize, search },
        } = useListUrlState(list)

        return (
            <div className="list-header-actions">
                <ActiveFilters list={list} />
                <Suspense
                    fallback={
                        <LoadingIndicator css={{ height: '3em' }} size={12} />
                    }
                >
                    <Render>
                        {() => {
                            captureSuspensePromises(
                                fields
                                    .filter((field) => field.path !== '_label_')
                                    .map((field) => () => field.initCellView())
                            )
                            return <Search list={list} />
                        }}
                    </Render>
                </Suspense>
                <CreateItem />
            </div>
        )
    },
}

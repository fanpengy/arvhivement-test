export interface global {
    router: {
        currentRouter: string
    }
    loading: {
        loading: boolean
        loadingText?: string
        loadingBackground?: string
        loadingSvg?: string
        loadingSvgViewBox?: string
    }
    scroll: {
        scrollTop: number
        scrollLeft: number
    }
}

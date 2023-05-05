import { ref, computed, ComputedRef } from 'vue'
import { useUserStore } from '../stores';

export interface LoadParams {
  currentPage: number;
  pageSize: number;
  cid?: string
}


const useLoadMore = <T extends keyof ReturnType<typeof useUserStore>>(
  actionName: T,
  total: ComputedRef<number>,
  params: LoadParams = { currentPage: 2, pageSize: 5 }
) => {
  const UserStore = useUserStore()
  const currentPage = ref(params.currentPage)
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize,
    cid: params.cid
  }))
  const loadMorePage = () => {
    if (!isLastPage.value){
      console.log('requestParams.value:',requestParams.value);
      if (typeof UserStore[actionName] === 'function') {
        (UserStore[actionName]as (params: LoadParams) => Promise<void>)(requestParams.value).then(() => {
          currentPage.value++
      })
      }
    }

  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage,
  }
}

export default useLoadMore

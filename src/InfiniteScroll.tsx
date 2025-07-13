import React, {
    useEffect, useRef, useState, useCallback,
    forwardRef, useImperativeHandle
} from 'react';

export interface ResponseData<T> {
    items: T[];
    total: number;
    offset: number;
}

export interface InfiniteScrollHandle<T> {
    reload: () => void;
    updateItem: (updatedItem: T, predicate: (item: T) => boolean) => void;
    removeItem: (predicate: (item: T) => boolean) => void;
    getItems: () => T[];
    push: (newItem: T) => void;
    unshift: (newItem: T) => void;
}

interface Props<T> {
    loadItems: (offset: number) => Promise<ResponseData<T>>;
    renderItem: (item: T) => React.ReactNode;
    loadingComponent?: React.ReactNode;
    errorComponent?: React.ReactNode;
    emptyComponent?: React.ReactNode;
    reverse?: boolean;
    style?: React.CSSProperties;
    className?: string;
    keyExtractor?: (item: T, index: number) => string | number;
}

function InfiniteScrollInner<T>(
    props: Props<T>,
    ref: React.Ref<InfiniteScrollHandle<T>>
) {
    const [items, setItems] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [isServerOut, setIsServerOut] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const sentinelaRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);
    const hasMoreItems = total === 0 || items.length < total;

    const loadMoreItems = useCallback(async () => {
        if (isLoadingRef.current || !hasMoreItems) return;

        isLoadingRef.current = true;
        setIsServerOut(false);

        try {
            const responseData = await props.loadItems(items.length);
            setItems(prev => [...prev, ...responseData.items]);
            setTotal(responseData.total);
        } catch (error) {
            console.error(error);
            setIsServerOut(true);
        } finally {
            isLoadingRef.current = false;
            setInitialLoadComplete(true);
        }
    }, [hasMoreItems, items.length, props]);

    const resetAndReload = useCallback(async () => {
        isLoadingRef.current = true;
        setIsServerOut(false);
        setInitialLoadComplete(false);
        try {
            const responseData = await props.loadItems(0);
            setItems(responseData.items);
            setTotal(responseData.total);
        } catch (error) {
            console.error(error);
            setIsServerOut(true);
        } finally {
            isLoadingRef.current = false;
            setInitialLoadComplete(true);
        }
    }, [props]);

    useImperativeHandle(ref, () => ({
        reload: resetAndReload,
        updateItem: (updatedItem, predicate) => {
            setItems(prev => prev.map(item => (predicate(item) ? updatedItem : item)));
        },
        removeItem: (predicate) => {
            setItems(prev => prev.filter(item => !predicate(item)));
            setTotal(prev => prev - 1);
        },
        getItems: () => items,
        push: (newItem) => {
            setItems(prev => [...prev, newItem]);
            setTotal(prev => prev + 1);
        },
        unshift: (newItem) => {
            setItems(prev => [newItem, ...prev]);
            setTotal(prev => prev + 1);
        }
    }));

    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && !props.keyExtractor) {
            console.warn(
                '[InfiniteScroll] Warning: "keyExtractor" prop is missing.\n' +
                'Using array index as key may lead to rendering issues when the list updates dynamically.\n' +
                'It is strongly recommended to provide a stable unique key for each item.'
            );
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMoreItems();
                }
            },
            {
                root: scrollRef.current,
                threshold: 0.1,
            }
        );

        const sentinela = sentinelaRef.current;
        if (sentinela) observer.observe(sentinela);

        return () => {
            if (sentinela) observer.unobserve(sentinela);
        };
    }, [loadMoreItems]);

    useEffect(() => {
        resetAndReload();
    }, []);

    const defaultLoading = <div style={{ padding: 16, textAlign: 'center', color: '#999' }}>Loading more...</div>;
    const defaultError = <div style={{ padding: 16, textAlign: 'center', color: 'red' }}>Error loading data.</div>;
    const defaultEmpty = <div style={{ padding: 16, textAlign: 'center', color: '#999' }}>No items found</div>;

    return (
        <div
            ref={scrollRef}
            style={{
                height: '100%',
                maxHeight: '100vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: props.reverse ? 'column-reverse' : 'column',
                ...props.style
            }}
            className={props.className}
        >
            {props.reverse && <div ref={sentinelaRef} />}

            {initialLoadComplete && items.length === 0 ? (
                props.emptyComponent ?? defaultEmpty
            ) : items.map((item, index) => {
                const key = props.keyExtractor?.(item, index) ?? index;
                return (
                    <React.Fragment key={key}>
                        {props.renderItem(item)}
                    </React.Fragment>
                );
            })}

            {!props.reverse && <div ref={sentinelaRef} />}

            {!initialLoadComplete && hasMoreItems && (props.loadingComponent ?? defaultLoading)}
            {isServerOut && (props.errorComponent ?? defaultError)}
        </div>
    );
}

const InfiniteScroll = forwardRef(InfiniteScrollInner) as <T>(
    props: Props<T> & { ref?: React.Ref<InfiniteScrollHandle<T>> }
) => ReturnType<typeof InfiniteScrollInner>;

export default InfiniteScroll;
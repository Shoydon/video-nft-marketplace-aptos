module my_addrx::video_nft_1{
    use std::signer;
    use std::vector;
    use std::string::String;

    struct State has store, key, drop, copy {
        nfts: vector<NFT>,
        count: u64
    }

    struct NFT has store, key, drop, copy {
        id: u64,
        owner: address,
        ipfs_hash: String,
        price: u64
    }

    fun init_module(creator: &signer){
        move_to(creator, State {
            nfts: vector::empty<NFT>(),
            count: 0
        })
    }

    entry fun add_nft(user: &signer, ipfs_hash: String, price: u64) acquires State {
        let user_addr = signer::address_of(user);
        let state = borrow_global_mut<State>(@my_addrx);
        let counter = state.count;
        let new_nft = NFT {
            id: counter,
            owner: user_addr,
            ipfs_hash,
            price
        };
        vector::push_back(&mut state.nfts, new_nft);

        counter = counter + 1;
        state.count = counter;
    }

    #[view]
    public fun view_count(): u64 acquires State {
        let state = borrow_global_mut<State>(@my_addrx);
        state.count
    } 

    #[view]
    public fun view_nfts(): vector<NFT> acquires State {
        let state = borrow_global_mut<State>(@my_addrx);
        state.nfts
    }
}
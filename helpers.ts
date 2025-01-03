type Proxy = {
  ip: string;
  port: number;
  protocol: string;
  uptime: number;
  proxy: string;
};

export async function getProxy(): Promise<
  { proxy: string; ip: string; port: number } | undefined
> {
  let proxies: Proxy[] | undefined;

  try {
    proxies = (
      await fetch(
        "https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=protocolipport&format=json"
      ).then((result) => result.json())
    ).proxies;

    if (proxies?.length) {
      shuffle(proxies);
    }
  } catch (err) {
    console.warn("proxy list not working", err);
  }

  const proxy = proxies?.find(
    (proxy: Proxy) => proxy.protocol === "socks4" && proxy.uptime > 40
  );

  return proxy
    ? { proxy: proxy.proxy, ip: proxy.ip, port: proxy.port }
    : undefined;
}

function shuffle(array: any[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

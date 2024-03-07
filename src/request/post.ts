import { useState } from 'react';
import { message } from 'antd';

const rootUrl = 'http://localhost:3003/';

function post(url: string, body: BodyInit, headers?: HeadersInit) {
  return fetch(rootUrl + url, {
    method: 'post',
    headers,
    body
  });
}

export function getPostFunc<Req, Resp>(
  url: string,
  preProcessor: (data: Req) => {
    body: BodyInit;
    headers?: HeadersInit;
  },
  processor: (...args: any[]) => Promise<Resp>
) {
  return function (data: Req) {
    const { body, headers } = preProcessor(data);
    return post(url, body, headers)
      .then(processor)
      .catch(err => {
        message.error('网络异常');
        return err;
      });
  };
}

export function JsonBody<Req>(data: Req) {
  return JSON.stringify(data);
}
export const JsonHeaders = { 'Content-Type': 'application/json' };
export function JsonPreProcessor<Req>(data: Req) {
  return {
    body: JSON.stringify(data),
    headers: JsonHeaders
  };
}

export function JsonProcessor<Resp>(res: any) {
  return res.json() as Resp;
}

export function usePost<Req, Resp>(
  url: string,
  preProcessor: (data: Req) => {
    body: BodyInit;
    headers: HeadersInit;
  },
  processor: (...args: any[]) => Promise<Resp>
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [result, setResult] = useState<Resp | null>(null);

  const postFunc = getPostFunc(url, preProcessor, processor);

  const launch = (data: Req) => {
    setLoading(true);
    postFunc(data)
      .then(res => setResult(res))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  };

  return { launch, error, result, loading };
}

export function usePostJson<Req, Resp = null>(url: string) {
  return usePost<Req, Resp>(url, JsonPreProcessor, JsonProcessor);
}

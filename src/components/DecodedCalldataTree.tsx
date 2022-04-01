import { ParamType } from '@ethersproject/abi';

import { Decoded } from '../lib/decodeCalldata';
interface Node {
  name: ParamType['name'];
  type: ParamType['type'];
}

interface Leaf extends Node {
  value: string;
  components?: never;
}

interface Tree extends Node {
  components: Array<Leaf | TreeNode>;
  value?: never;
}

type TreeNode = Leaf | Tree;

function attachValues(components: ParamType[], decoded: Decoded): TreeNode[] {
  return components.map((input, index): TreeNode => {
    if (input.type === 'tuple') {
      const value = decoded[index];

      if (!Array.isArray(value)) {
        throw new Error(
          'input.type is tuple, but decoded value is not an array',
        );
      }

      const { components } = input;

      return {
        name: input.name,
        type: input.type,
        components: attachValues(components, value),
      };
    }

    return {
      name: input.name,
      type: input.type,
      value: String(decoded[index]),
    };
  });
}

function CalldataTreeNode({
  node,
  className,
}: {
  node: TreeNode;
  className?: string;
}) {
  if ('value' in node) {
    return (
      <span className={className}>
        <code>
          {node.name ? (
            <b className="text-deth-pink"> {node.name} </b>
          ) : (
            <b className="text-pink-600">unknown</b>
          )}
        </code>{' '}
        <code>
          <b id="node-type" className=" text-purple-600">
            {node.type}
          </b>
          <code id="node-value"> {node.value} </code>
        </code>
      </span>
    );
  }

  return (
    <section className={className}>
      <b className=""> {node.name} </b>
      <ul className="pb-1 pt-2">
        {node.components.map((node, index) => (
          <CalldataTreeNode key={index} node={node} className="border-l pl-6" />
        ))}
      </ul>
    </section>
  );
}

export function DecodedCalldataTree({
  fnName,
  fnType,
  decoded,
  inputs,
}: {
  fnName?: string;
  fnType?: string;
  decoded: Decoded;
  inputs: ParamType[];
}) {
  const tree = attachValues(inputs, decoded);
  return (
    <output className="bg-red-600 mb-2">
      <pre className="bg-deth-gray-900">
        <section>
          <code className="text-purple-600 font-bold">{fnType}</code>{' '}
          <code>{fnName}</code>
        </section>
        {tree.map((node, index) => (
          <div data-testid={index} key={index}>
            <CalldataTreeNode node={node} />
          </div>
        ))}
      </pre>
    </output>
  );
}
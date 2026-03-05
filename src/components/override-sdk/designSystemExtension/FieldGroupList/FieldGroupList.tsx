// FieldGroupList is one of the few components that does NOT have getPConnect.
//  So, no need to extend PConnProps
interface FieldGroupListProps {
  // If any, enter additional props that only exist on this component
  items: any[] | any;
}

export default function FieldGroupList(props: FieldGroupListProps) {

  return (
    <>
      {props.items.map(item => item.children)}
    </>
  );
}

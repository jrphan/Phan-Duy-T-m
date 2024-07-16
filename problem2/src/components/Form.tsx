import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TOKEN_DATA } from "../data/data";
import { Form, Select, Button, InputNumber, Spin } from "antd";
import { TOKEN_ITEM } from "../interface/form";
import useNotification from "./NotificationComponent";

const { Option } = Select;

const FormComponent: React.FC = () => {
  const [form] = Form.useForm();
  const { openNotification, contextHolder } = useNotification();
  const [unitFrom, setUnitFrom] = useState<string>("");
  const [unitTo, setUnitTo] = useState<string>("USD");
  const [unitFromItem, setUnitFromItem] = useState<
    TOKEN_ITEM | null | undefined
  >(null);
  const [unitToItem, setUnitToItem] = useState<TOKEN_ITEM | null | undefined>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataAvailble, setDataAvailble] = useState({
    available: 2001,
    unit: "GMX",
  });

  const [dataFrom, setDataFrom] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFilterUnit = (unit: string | undefined) => {
    if (unit === null) {
      return TOKEN_DATA;
    }

    return TOKEN_DATA.filter((token) => token.currency !== unit);
  };

  useEffect(() => {
    if (dataAvailble && dataAvailble.unit) {
      setUnitFrom(dataAvailble.unit);
    }
  }, [dataAvailble]);

  useEffect(() => {
    if (unitFrom) {
      let itemFrom: TOKEN_ITEM | null | undefined = TOKEN_DATA.find(
        (token) => token.currency === unitFrom
      );
      setUnitFromItem(itemFrom);
    }
  }, [unitFrom]);

  useEffect(() => {
    if (unitTo) {
      let itemTo: TOKEN_ITEM | null | undefined = TOKEN_DATA.find(
        (token) => token.currency === unitTo
      );
      setUnitToItem(itemTo);
    }
  }, [unitTo]);

  useEffect(() => {
    if (dataFrom && unitFromItem && unitToItem) {
      let data = (dataFrom * unitFromItem.price) / unitToItem.price;
      form.setFieldValue("to", data);
    }
  }, [dataFrom, form, unitFromItem, unitToItem]);

  const handleReset = () => {
    setDataFrom(0);
    form.resetFields();
    form.setFieldValue("to", 0);
  };

  const handleSubmit = (values: any) => {
    // Call api transfer
    console.log(values);

    if (values.unitFrom !== dataAvailble.unit) {
      openNotification(
        `You do not have enough ${values.unitFrom.toUpperCase()} to transfer`,
        "error"
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleReset();
      openNotification("Transfer successfully", "success");
    }, 3000);
  };

  return (
    <>
      {contextHolder}
      <FormCustom form={form} onFinish={handleSubmit} layout="vertical">
        <Available>
          Available: <span>{dataAvailble.available}</span> {dataAvailble.unit}
        </Available>

        <Row>
          <Form.Item
            className="input_item"
            label={<LabelCustom>From</LabelCustom>}
            name="from"
            rules={[
              {
                required: true,
                message: "Please enter the quantity to transfer",
              },
            ]}
          >
            <InputNumber
              min={0}
              max={dataAvailble.available}
              className="input_number"
              onChange={(value: any) => setDataFrom(value)}
            />
          </Form.Item>
          <Form.Item
            className="unit_item"
            label={<HiddenLabel>Unit</HiddenLabel>}
            name="unitFrom"
            rules={[{ required: true, message: "Field is required" }]}
            initialValue={dataAvailble.unit}
          >
            <Select showSearch onChange={(value) => setUnitFrom(value)}>
              {handleFilterUnit(unitTo).map((token, idx) => {
                return (
                  <Option value={token.currency} key={idx}>
                    <OptionCustom>
                      {token.icon && (
                        <IconCustom src={token.icon} alt={token.currency} />
                      )}
                      <span>{token.currency}</span>
                    </OptionCustom>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Row>

        <Row>
          <Form.Item
            className="input_item"
            label={<LabelCustom>To</LabelCustom>}
            name="to"
            rules={[{ required: true, message: "Please input value" }]}
            initialValue={0}
          >
            <InputNumber min={0} className="input_number" disabled />
          </Form.Item>
          <Form.Item
            className="unit_item"
            label={<HiddenLabel>Unit</HiddenLabel>}
            name="unitTo"
            rules={[{ required: true, message: "Field is required" }]}
            initialValue={unitTo}
          >
            <Select
              showSearch
              onChange={(value) => setUnitTo(value)}
              disabled={!unitFromItem}
            >
              {handleFilterUnit(unitFrom).map((token, idx) => {
                return (
                  <Option value={token.currency} key={idx}>
                    <OptionCustom title={token.currency}>
                      {token.icon && (
                        <IconCustom src={token.icon} alt={token.currency} />
                      )}
                      <span>{token.currency}</span>
                    </OptionCustom>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Row>
        <WrapperInfo>
          <div className="row">
            <div className="label">Price</div>
            <div className="transfer">
              1 {unitFromItem?.currency.toUpperCase()} ={" "}
              {unitFromItem && unitToItem
                ? `${
                    unitFromItem.price / unitToItem.price
                  } ${unitToItem.currency.toUpperCase()}`
                : "-- --"}
            </div>
          </div>

          <div className="row pb_1">
            <div className="label">You will receice</div>
            <div className="coin">
              {dataFrom && unitToItem && unitFromItem
                ? `${
                    (dataFrom * unitFromItem.price) / unitToItem.price
                  } ${unitToItem.currency.toUpperCase()}`
                : "-- --"}
            </div>
          </div>

          <div className="row text_confirm">
            Please confirm conversion within the time
          </div>
        </WrapperInfo>
        <WrapperButton>
          <CustomBtnOutLine type="default" size="large" onClick={handleReset}>
            Reset
          </CustomBtnOutLine>
          <CustomBtn
            type="primary"
            htmlType="submit"
            size="large"
            onClick={(e) => {
              if (loading) {
                e.preventDefault();
              }
            }}
            className={loading ? "disabled" : ""}
          >
            {loading ? <CustomSpin spinning /> : "Transfer"}
          </CustomBtn>
        </WrapperButton>
      </FormCustom>
    </>
  );
};

export default FormComponent;

const CustomBtnOutLine = styled(Button)`
  color: #828282 !important;
  text-transform: capitalize;
  box-shadow: none !important;
  transition: 0.5s all ease;

  &:hover {
    transition: 0.5s all ease;
    color: #c9a820 !important;
    border-color: #c9a820 !important;
  }
`;

const CustomBtn = styled(Button)`
  background-color: #fcd535 !important;
  color: #202630 !important;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: none !important;
  transition: 0.5s all ease;

  &:hover {
    background-color: #dbb728 !important;
    transition: 0.5s all ease;
  }

  &.disabled {
    user-select: none;
    cursor: not-allowed;
  }
`;

const Available = styled.div`
  position: absolute;
  top: 2.3rem;
  right: 2rem;
  color: #828282;

  span {
    color: #000;
    font-weight: 600;
  }
`;

const WrapperInfo = styled.div`
  padding: 0.5rem 0 2.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .label {
      font-size: 1.7rem;
      color: #828282;
    }

    .transfer {
      color: #828282;
      font-weight: 600;
    }

    .coin {
      font-size: 2rem;
      color: #dbb728;
      font-weight: 600;
    }
  }

  .pb_1 {
    padding-bottom: 0.5rem;
  }

  .text_confirm {
    padding-top: 1rem;
    border-top: 0.1rem solid #e0e0e0;
    color: #828282;
  }
`;

const WrapperButton = styled.div`
  display: flex;
  gap: 1rem;

  button {
    width: 100%;
  }
`;

const FormCustom = styled(Form)`
  max-width: 90vw;
  width: 50rem;
  background-color: #fff;
  padding: 2rem;
  border-radius: 1rem;
  position: relative;
  box-shadow: 0.5rem 0.5rem 1.5rem rgba(0, 0, 0, 0.1),
    0.5rem 0.5rem 2.5rem rgba(0, 0, 0, 0.1);
`;

const LabelCustom = styled.div`
  font-weight: 600;
  color: #828282;
`;

const HiddenLabel = styled.div`
  visibility: hidden;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;

  .input_item {
    width: 70%;
    .input_number {
      width: 100%;
    }
  }

  .unit_item {
    width: 30%;
  }

  :where(.css-dev-only-do-not-override-p8b6i).ant-form-item
    .ant-form-item-label
    > label.ant-form-item-required:not(
      .ant-form-item-required-mark-optional
    )::before {
    display: none;
  }
`;

const OptionCustom = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-weight: bold;
    text-transform: uppercase;
  }
`;

const IconCustom = styled.img`
  width: auto;
  height: 2rem;
  object-fit: contain;
`;

const CustomSpin = styled(Spin)`
  .ant-spin-dot-item {
    background-color: #fff;
  }
`;

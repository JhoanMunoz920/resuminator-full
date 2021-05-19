import { Content } from "@tiptap/core";
import React from "react";
import { FiPlus } from "react-icons/fi";
import EditorWithLabel from "../../../components/common/EditorWithLabel";
import InputWithLabel from "../../../components/common/InputWithLabel";
import StartEndDatePicker from "../../../components/common/StartEndDatePicker";
import TooltipIconButton from "../../../components/common/TooltipIconButton";
import Section from "../../../components/layouts/Section";
import { getUniqueID } from "../../../utils";
import ExpandableCard from "../ExpandableCard";
import SectionControls from "../SectionControls";
import useExperienceStore from "./store";
import { ExperienceDataObject } from "./types";

const Experience = () => {
  const data = useExperienceStore((state) => state.data);
  const isDisabled = useExperienceStore((state) => state.isDisabled);
  const toggleDisabled = useExperienceStore((state) => state.toggleDisabled);
  const addData = useExperienceStore((state) => state.add);
  const updateData = useExperienceStore((state) => state.update);

  //This will be removed when server is connected. For mock purposes only.
  const DummyData: ExperienceDataObject = {
    _id: getUniqueID(),
    jobTitle: "Student Developer @ CERN-HSF",
    company: "Google Summer of Code '20",
    location: "Remote",
    description: "<p>Testing Testing</p>",
    link: "",
    tags: ["GSoC", "React"],
    start: new Date(),
    end: new Date(),
    isHidden: false,
  };

  //mocking data from DB.
  const getNewObject = async () => {
    return DummyData;
  };

  //Mock async request
  const handleAdd = async () => {
    await getNewObject().then((res) => addData(res));
  };

  //Mocked delete request from server.
  const handleDelete = async (id: string) => {
    console.log(`Deleted ${id}`);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const [key, value] = [e.target.name, e.target.value];
    updateData(index, key, value);
  };

  const handleEditorChange = (index: number, output: Content) => {
    updateData(index, "description", output);
  };

  const handleDateChange = (index: number, key: string) => (date: Date) => {
    updateData(index, key, date);
  };

  const handleTagsInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    const tags = value !== "" ? value.split(",") : [];
    updateData(index, "tags", tags);
  };

  return (
    <Section
      header={{
        title: "Work Experience",
        subtitle: "Add your recent work experiences and internships.",
        mb: "2",
      }}
    >
      <SectionControls handler={{ isDisabled, toggleDisabled }}>
        <TooltipIconButton
          label="Add new experience"
          aria-label="New-Experience"
          icon={<FiPlus />}
          onClick={handleAdd}
        />
      </SectionControls>
      {data.map((item, index) => (
        <ExpandableCard
          key={index}
          title={item.company}
          subtitle={item.jobTitle}
          visibilityHandler={{
            value: item.isHidden,
            setValue: () => updateData(index, "isHidden", !item.isHidden),
          }}
          deleteHandler={() => handleDelete(item._id)}
        >
          <InputWithLabel
            label="Job Title"
            name="jobTitle"
            placeholder="Rocket Scientist"
            value={item.jobTitle}
            onChange={(e) => handleChange(e, index)}
          />
          <InputWithLabel
            label="Organization"
            name="company"
            placeholder="Tesla"
            value={item.company}
            onChange={(e) => handleChange(e, index)}
          />
          <InputWithLabel
            label="Location"
            name="location"
            placeholder="Start typing to search location"
            value={item.location}
            onChange={(e) => handleChange(e, index)}
          />
          <EditorWithLabel
            onChange={(output) => handleEditorChange(index, output)}
            defaultValue={item.description}
            label="Description"
          />
          <StartEndDatePicker
            values={{ start: item.start, end: item.end }}
            onChangeHandler={(key) => handleDateChange(index, key)}
          />
          <InputWithLabel
            label="Tags"
            name="tags"
            placeholder="Separate keywords by commas"
            value={item.tags.toString()}
            onChange={(e) => handleTagsInput(e, index)}
          />
          <InputWithLabel
            label="Link"
            name="link"
            value={item.link}
            onChange={(e) => handleChange(e, index)}
          />
        </ExpandableCard>
      ))}
    </Section>
  );
};

export default Experience;
